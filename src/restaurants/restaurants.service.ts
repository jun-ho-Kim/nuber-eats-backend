import { Injectable } from "../../node_modules/@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from "./entities/restaurant.entity";
import { Repository } from "../../node_modules/typeorm";


@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>
    ) {}
    getAll(): Promise<Restaurant[]> {
        return this.restaurants.find();
    } 
}
