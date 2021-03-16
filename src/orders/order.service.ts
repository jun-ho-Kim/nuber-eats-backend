import { Injectable } from "../../node_modules/@nestjs/common";
import { InjectRepository } from "../../node_modules/@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "../../node_modules/typeorm";
import { User, UserRole } from "../users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { Restaurant } from "../restaurants/entities/restaurant.entity";
import { Dish } from "../restaurants/entities/dish.entity";
import { OrderItem } from "./entities/order-items.entity";
import { GetOrdersInput, GetOrdersOutput } from "./dtos/get-orders.dto";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
        @InjectRepository(OrderItem)
        private readonly orderItems: Repository<OrderItem>,
    ) {}
    async createOrder(
        customer: User,
        {restaurantId, items}: CreateOrderInput,
    ): Promise<CreateOrderOutput> {
        try{
            const restaurant = await this.restaurants.findOne(restaurantId);
            if(!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found",
                };
            };
            let orderFinalPrice = 0;
            const orderItems: OrderItem[] = [];
            for (const item of items) {
                const dish = await this.dishes.findOne(item.dishId);
                console.log(`USd + ${dish.price}`)
                if(!dish) {
                    return {
                        ok: false,
                        error: 'Dish not found',
                    };
                }
                let dishFinalPrice = dish.price;
                for(const itemOption of item.options) {
                    const dishOption = dish.options.find(
                        dishOption => dishOption.name === itemOption.name
                    );
                    if(dishOption) {
                        if(dishOption.extra) {
                            console.log(`$USD + ${dishOption.extra}`);
                            dishFinalPrice = dishFinalPrice + dishOption.extra;
                        } else {
                            const dishOptionChoice = dishOption.choices.find(
                            optionChoice => optionChoice.name === itemOption.choice
                            );
                            if(dishOptionChoice) {
                                if(dishOptionChoice.extra) {
                                    console.log(`USD + ${dishOptionChoice.extra}`);
                                    dishFinalPrice = dishFinalPrice + dishOptionChoice.extra;
                                }
                            }
                        }
                    }
                }
                orderFinalPrice = orderFinalPrice + dishFinalPrice;
                const orderItem = await this.orderItems.save(
                    this.orderItems.create({
                        dish,
                        options: item.options,
                    }),
                );
                orderItems.push(orderItem);
            }
            await this.orders.save(
                this.orders.create({
                    customer,
                    restaurant,
                    total: orderFinalPrice,
                    items: orderItems,
                }),
            );
            return {
                ok: true,
            };
        } catch(error) {
            console.log(error);
            return {
                ok: false,
                error: 'Could not create order',
            };
        }
    }

    async getOrders(
        user: User,
        { status }: GetOrdersInput
    ): Promise<GetOrdersOutput> {
        try {
            let orders: Order[];
            if(user.role === UserRole.Client) {
                orders = await this.orders.find({
                    where: {
                        customer: user,
                        ...(status && {status}),
                    }
                })
            } else if(user.role === UserRole.Delivery) {
               orders = await this.orders.find({
                    where: {
                        driver: user,
                        ...(status && {status}),
                    }
                })
            } else if(user.role === UserRole.Owner) {
                const restaurants = await this.restaurants.find({
                    where: {
                        owner: user,
                    },
                    relations: ['orders'],
                });
                orders = restaurants.map(restaurant => restaurant.orders).flat(1);
                if(status) {
                    orders = orders.filter(order => order.status === status);
                }
            
            }
            return {
                ok: true,
                orders,   
            };
        } catch {
            return {
                ok: false,
                error: 'Could not get orders',
            }
        }
    }



}