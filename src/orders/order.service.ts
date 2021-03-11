import { Injectable } from "../../node_modules/@nestjs/common";
import { InjectRepository } from "../../node_modules/@nestjs/typeorm";
import { Order } from "./entities/order.entity";
import { Repository } from "../../node_modules/typeorm";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>
    ) {}
}