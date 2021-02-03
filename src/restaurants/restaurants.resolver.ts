import { Resolver, Query, Args, Mutation } from "../../node_modules/@nestjs/graphql";
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { RestaurantService } from './restaurants.service';

@Resolver(of => Restaurant)
/* Resolver 데코레이터에 of=>Restaurant를 추가해줌으로써
코드의 표현력이 더 좋아진다. */
export class RestaurantsResolver {
    constructor(private readonly restaurantService: RestaurantService) {}
    @Query(returns => [Restaurant]) /* GraphQL에서 대괄호 표현 방법 */
        //veganOnly라는 이름을 가진 argument 요청하기
        restaurants(): Promise<Restaurant[]> {
        return this.restaurantService.getAll();
    }
    @Mutation(returns => Boolean)
    async createRestaurant(
        @Args() createRestaurantDto: CreateRestaurantDto,
    ): Promise<boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto); 
        } catch(e) {
            console.log(e);
            return false;
        }
        return true;
    }
}