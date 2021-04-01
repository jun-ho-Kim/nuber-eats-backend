import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsResolver, DishResolver, CategoryResolver } from './restaurants.resolver';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';
import { CategoryRepository } from './repository/category.repository';
import { Dish } from './entities/dish.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository, Dish])],
    providers: [
        RestaurantsResolver,
        DishResolver,
        RestaurantService,
        CategoryResolver,
    ],
})
export class RestaurantsModule {}
