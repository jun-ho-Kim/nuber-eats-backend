import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from "./entities/restaurant.entity";
import { Repository } from "typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { User } from "../users/entities/user.entity";
import { Category } from "./entities/category.entity";


@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category)
        private readonly category: Repository<Category>
    ) {}
    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(createRestaurantInput);
            newRestaurant.owner = owner;
            const categoryName = createRestaurantInput.categoryName
            .trim().toLocaleLowerCase();
            // space친 공간의 전역을 -로 대체한다.
            const categorySlug = categoryName.replace(/ /g, '-')
            let category = await this.category.findOne({ slug: categorySlug });
            if(!category) {
                category = await this.category.save(
                    this.category.create( { slug: categorySlug, name: categoryName }))
            }
            newRestaurant.category = category;
            await this.restaurants.save(newRestaurant);
            return {
                ok: true,
            };
        } catch {
            return {
                error: 'Could not create restaurant',
                ok: false
            }
        }

    }
}
