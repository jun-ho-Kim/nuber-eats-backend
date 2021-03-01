import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { RestaurantService } from './restaurants.service';
import { AuthUser } from "../auth/auth-user.decorator";
import { User, UserRole } from "../users/entities/user.entity";
import { SetMetadata } from "../../node_modules/@nestjs/common";
import { Role } from "../auth/role.decorator";

@Resolver(of => Restaurant)
/* Resolver 데코레이터에 of=>Restaurant를 추가해줌으로써
코드의 표현력이 더 좋아진다. */
export class RestaurantsResolver {
    constructor(private readonly restaurantService: RestaurantService) {}
    @Mutation(returns => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args('input') createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
            return this.restaurantService.createRestaurant(
                authUser,
                createRestaurantInput
            ); 
    }
}