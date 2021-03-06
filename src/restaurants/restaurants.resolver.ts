import { Resolver, Query, Args, Mutation, ResolveField, Int, Parent } from "@nestjs/graphql";
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
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { Category } from "./entities/category.entity";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";
import { MyRestaurantsOutput } from "./dtos/my-restaurants.dto";
import { MyRestaurantInput, MyRestaurantOutput } from "./dtos/my-restaurant.dto";

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
        @AuthUser() owner: User,
        @Args('input') editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(owner, editRestaurantInput);
    }

    @Mutation(returns => DeleteRestaurantOutput)
    @Role(['Owner'])
    async deleteRestaurant(
        @AuthUser() owner: User,
        @Args('input') deleteRestaurantInput: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(
            owner, 
            deleteRestaurantInput
        );
    };

    @Query(type => RestaurantsOutput)
    @Role(['Any'])
    restaurants(
        @Args('input') restaurantsInput: RestaurantsInput
    ): Promise<RestaurantsOutput> {
        return this.restaurantService.allRestaurants(restaurantsInput);
    };

    @Query(type => RestaurantOutput)
    @Role(['Any'])
    restaurant(
        @Args('input') restaurantInput: RestaurantInput
    ): Promise<RestaurantOutput> {
        return this.restaurantService.findRestaurantById(restaurantInput)
    }

    @Query(type => SearchRestaurantOutput)
    searchRestaurant(
        @Args('input') searchRestaurantInput: SearchRestaurantInput
    ): Promise<SearchRestaurantOutput> {
        return this.restaurantService.searchRestaurantName(searchRestaurantInput);
    }

    @Query(type => MyRestaurantsOutput)
    @Role(["Owner"])
    myRestaurants(
        @AuthUser() owner: User,
    ): Promise<MyRestaurantsOutput> {
        return this.restaurantService.myRestaurants(owner);
    };

    @Query(type => MyRestaurantOutput)
    @Role(["Owner"])
    myRestaurant(
        @AuthUser() owner: User,
        @Args('input') myRestaurantInput: MyRestaurantInput
    ): Promise<MyRestaurantOutput> {
        return this.restaurantService.myRestaurant(owner, myRestaurantInput);
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

@Resolver(of => Category)
export class CategoryResolver {
    constructor(private readonly restaurantService: RestaurantService) {}

    @ResolveField(type => Int)
    restaurantCount(@Parent() category: Category): Promise<number> {
        console.log("category:",  category);
        return this.restaurantService.countRestaurant(category);
    }

    @Query(type => AllCategoriesOutput)
    allCategories(): Promise<AllCategoriesOutput> {
        return this.restaurantService.allCategories();
    }

    @Query(type => CategoryOutput)
    category(@Args('input') categoryInput: CategoryInput): Promise<CategoryOutput> {
        return this.restaurantService.findCategoryBySlug(categoryInput);
    }
}