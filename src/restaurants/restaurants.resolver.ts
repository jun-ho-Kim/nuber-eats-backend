import { Resolver, Query, Args, Mutation } from "../../node_modules/@nestjs/graphql";
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";

@Resolver(of => Restaurant)
/* Resolver 데코레이터에 of=>Restaurant를 추가해줌으로써
코드의 표현력이 더 좋아진다. */
export class RestaurantsResolver {
    @Query(returns => [Restaurant]) /* GraphQL에서 대괄호 표현 방법 */
        //veganOnly라는 이름을 가진 argument 요청하기
        restaurants(@Args('veganOnly') veganOnly: boolean): Restaurant[] /* typesrcript에서 대괄호 표현 방법 */ {
        console.log(veganOnly); // true
        return [];
    }
    @Mutation(returns => Boolean)
    createRestaurant(
        @Args() createRestaurantInput: CreateRestaurantDto,
    ): boolean {
        console.log(createRestaurantInput);
        return true;
    }
}