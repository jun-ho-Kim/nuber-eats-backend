import { Injectable } from "../../node_modules/@nestjs/common";
import { InjectRepository } from "../../node_modules/@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "../../node_modules/typeorm";
import { User } from "../users/entities/user.entity";
import { CreateOrderInput, CreateOrderOutput } from "./dtos/create-order.dto";
import { Restaurant } from "../restaurants/entities/restaurant.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>
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
        const order = await this.orders.save(
            this.orders.create({
                customer,
                restaurant,
            }),
        );
        console.log(order);
    }
}