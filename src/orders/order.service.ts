import { Injectable } from "../../node_modules/@nestjs/common";
import { InjectRepository } from "../../node_modules/@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "../../node_modules/typeorm";
import { User } from "../users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { Restaurant } from "../restaurants/entities/restaurant.entity";
import { Dish } from "../restaurants/entities/dish.entity";
import { OrderItem } from "./entities/order-items.entity";

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
        const restaurant = await this.restaurants.findOne(restaurantId);
        if(!restaurant) {
            return {
                ok: false,
                error: "Restaurant not found",
            };
        };
        items.forEach(async item => {
            const dish = await this.dishes.findOne(item.dishId);
            if(!dish) {
                //abort this whole thing
            }
            await this.orderItems.save(
                this.orderItems.create({
                    dish,
                    options: item.options,
                }),
            )
        })
        // const order = await this.orders.save(
        //     this.orders.create({
        //         customer,
        //         restaurant,
        //     }),
        // );
    }
}