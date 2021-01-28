import { Resolver, Query, Args } from "../../node_modules/@nestjs/graphql";
import { Restaurant } from './entities/restaurant.entity';

@Resolver()
export class RestaurantsResolver {
    @Query(returns => Restaurant)
        myRestaurant() {
        return true;
    }
}