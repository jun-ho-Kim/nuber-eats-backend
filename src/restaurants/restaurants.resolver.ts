import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { RestaurantService } from './restaurants.service';
import { AuthUser } from "../auth/auth-user.decorator";
import { User, UserRole } from "../users/entities/user.entity";
import { SetMetadata } from "@nestjs/common";
import { Role } from "../auth/role.decorator";
import { EditRestaurantOutput, EditRestaurantInput } from "./dtos/edit-restaurant.dto";
import { Dish } from "./entities/dish.entity";
import { CreateDishOutput, CreateDishInput } from "./dtos/create-dish.dto";
import { EditDishOutput, EditDishInput } from "./dtos/edit-dish.dto";
import { DeleteDishOutput, DeleteDishInput } from "./dtos/delete-dish.dto";

@Resolver(of => Restaurant)
/* Resolver 데코레이터에 of=>Restaurant를 추가해줌으로써
코드의 표현력이 더 좋아진다. */
export class RestaurantsResolver {
    constructor(private readonly restaurantService: RestaurantService) {}
    @Mutation(returns => CreateRestaurantOutput)
    @Role(["Owner"])
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args('input') createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
            return this.restaurantService.createRestaurant(
                authUser,
                createRestaurantInput
            ); 
    };
    @Mutation(returns => EditRestaurantOutput)
    @Role(['Owner'])
    async editRestaurant(
        @AuthUser() authUser: User,
        @Args('input') editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        return {ok:true};
    }
}

@Resolver(of => Dish)
export class DishResolver {
    constructor(private readonly restaurantService: RestaurantService) {}

    @Mutation(type => CreateDishOutput)
    @Role(['Owner'])
    createDish(
        @AuthUser() owner: User,
        @Args('input') createDishInput: CreateDishInput
    ): Promise<CreateDishOutput> {
        return this.restaurantService.createDish(owner, createDishInput);
    }

    @Mutation(type => EditDishOutput)
    @Role(['Owner'])
    editDish(
        @AuthUser() owner: User,
        @Args('input') editDishInput: EditDishInput
    ): Promise<EditDishOutput> {
        return this.restaurantService.editDish(owner, editDishInput);
    };

    @Mutation(type => DeleteDishOutput)
    @Role(['Owner'])
    deleteDish(
        @AuthUser() owner: User,
        @Args('input') deleteDishInput: DeleteDishInput
    ): Promise<DeleteDishOutput> {
        return this.restaurantService.deleteDish(owner, deleteDishInput);
    }
}
