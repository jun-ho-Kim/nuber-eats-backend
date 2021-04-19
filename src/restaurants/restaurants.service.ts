import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from "./entities/restaurant.entity";
import { Like, Raw, Repository } from "typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { User } from "../users/entities/user.entity";
import { Category } from "./entities/category.entity";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { CategoryRepository } from "./repository/category.repository";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { Dish } from "./entities/dish.entity";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { AllCategoriesOutput } from "./dtos/all-categories.dto";
import { CategoryInput, CategoryOutput } from "./dtos/category.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";
import { MyRestaurantsOutput } from "./dtos/my-restaurants.dto";
import { MyRestaurantInput, MyRestaurantOutput } from "./dtos/my-restaurant.dto";


@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category)
        private readonly categories: CategoryRepository,
        @InjectRepository(Dish)
        private readonly dishes: Repository<Dish>,
    ) {}

    // async getOrCreate(name: string): Promise<Category> {
    //     const categoryName = name.trim().toLowerCase();
    //     const categorySlug = categoryName.replace(/ /g, '-');
    //     let category = await this.categories.findOne({slug: categorySlug});
    //     if(!category) {
    //         category = await this.categories.save(
    //             this.categories.create({slug: categorySlug, name: categoryName})
    //         );
    //     }
    //     return category;
    // }

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
        try {
            const newRestaurant = this.restaurants.create(
                createRestaurantInput,
            );
            newRestaurant.owner = owner;
            const category = await this.categories.getOrCreate(
                createRestaurantInput.categoryName,
              );
            newRestaurant.category = category;
            await this.restaurants.save(newRestaurant);
            return {
                ok: true,
                restaurantId: newRestaurant.id
            };
        } catch {
            return {
                error: 'Could not create restaurant',
                ok: false
            }
        };
    };
    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput
    ): Promise<EditRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(
                editRestaurantInput.restaurantId
            );
            if(!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found',
                };
            };
            if(owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: 'You can`t edit a Restaurant that you don`t own',
                };
            };
            let category: Category = null;
            if(editRestaurantInput.categoryName) {
                category = await this.categories.getOrCreate(
                    editRestaurantInput.categoryName
                );
            }
            await this.restaurants.save([
                {
                    // id: editRestaurantInput.restraurantId,        ])
                    id: editRestaurantInput.restaurantId,
                    ...editRestaurantInput,
                    ...(category && {category})
                },
            ]);
            return {
                ok: true,
            }            
            // return {
            //     ok: true,
            //     error: null,
            // }
        } catch {
            return {
                ok: false,
                error: 'Could not edit Restaurant',
            }
        };
    };

    async deleteRestaurant(
        owner: User,
        {restaurantId}: DeleteRestaurantInput
    ): Promise<DeleteRestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId);
            if(!restaurant) {
                return {
                    ok: false,
                    error: 'restaurant not found',
                }
            }
            if(owner.id !== restaurant.ownerId) {
                return {
                    ok: false,
                    error: "You can`t delete a restaurant that don`t own",
                }
            }
            await this.restaurants.delete(restaurantId);
            return {
                ok: true
            }

        } catch {
            return {
                ok: false,
                error: "Could not delete restaurant."
            }
        }
    };

    async createDish(
        owner: User,
        createDishInput: CreateDishInput
    ): Promise<CreateDishOutput> {
        try {
            const restaurant = await this.restaurants.findOne(
                createDishInput.restaurantId
            );
            if(!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not Found"
                };
            }
            // if(owner.id !== restaurant.ownerId) {
            //     console.log(owner.id, restaurant.ownerId)
            //     return {
            //         ok: false,
            //         error: "You can`t do that",
            //     };
            // }
            await this.dishes.save(
                this.dishes.create(
                    {...createDishInput, restaurant}
                )
            )
            return {
                ok: true,
            };
        } catch(error) {
            console.log(error)
            return {
                ok: false,
                error: "Could not create dish",
            }
        };
    };

    async editDish(
        owner: User,
        editDishInput: EditDishInput
    ): Promise<EditDishOutput> {
        try {
            const dish = await this.dishes.findOne(editDishInput.dishId, {
                relations: ['restaurant'],
            });
            if(!dish) {
                return {
                    ok: false,
                    error: "Dish not found",
                }
            }
            if(dish.restaurant.ownerId !==  owner.id) {
                return {
                    ok: false,
                    error: "You can`t do that",
                };
            }
            await this.dishes.save([
                {
                    id: editDishInput.dishId,
                    ...editDishInput,
                }
            ]);
            return {
                ok: true,
            }
        } catch {
            return {
                ok: false,
                error: 'Could not delete dish',
            }
        }
    };

    async deleteDish(
        owner: User,
        {dishId}: DeleteDishInput
    ): Promise<DeleteDishOutput> {
        try {
            const dish = await this.dishes.findOne(dishId, {
                relations: ['restaurant'],
            });
            if(!dish) {
                return {
                    ok: false,
                    error: "Dish not Found",
                };
            }
            if(dish.restaurant.ownerId !== owner.id) {
                return {
                    ok: false,
                    error: "You can`t do that"
                };
            }
            await this.dishes.delete(dishId);
            return {
                ok: true,
            }
        } catch {
            return {
                ok: false,
                error: "Could not delete dish"
            }
        }
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
            const categories = await this.categories.find();
            return {
                ok: true,
                categories,
            }
        } catch {
            return {
                ok: false,
                error: "Could not load categories",
            }
        }
    }
    countRestaurant(category: Category) {
        return this.restaurants.count({category});
    }

    async findCategoryBySlug({slug, page}: CategoryInput): Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne(
                { slug },
            );
            if(!category) {
                return {
                    ok: false,
                    error: "Category not found",
                };
            }
            const restaurants = await this.restaurants.find({
                where: {category},
                // take: 한번에 entity를 가져올 수 있는 개수
                take: 25,
                // skip: 이전에 나온 entity는 건너뛴다.
                skip: (page-1) * 25
            });
            const totalResult = await this.countRestaurant(category);
            return {
                ok: true,
                restaurants,
                category,
                totalPages: Math.ceil(totalResult /25),
            }
        } catch {
            return {
                ok: false,
                error: "Could not load category",
            }
        }
    };

    async allRestaurants(
        {page} :RestaurantsInput
    ): Promise<RestaurantsOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                take: 2,
                skip: (page-1) * 2,
            });

            return {
                ok: true,
                results: restaurants,
                totalPages: Math.ceil(totalResults / 2),
                totalResults,
            }
        } catch {
            return {
                ok: false,
                error: "Could not load Restaurant"
            }
        }
    }

    async findRestaurantById(
        {restaurantId}: RestaurantInput
    ): Promise<RestaurantOutput> {
        try {
            const restaurant = await this.restaurants.findOne(restaurantId);
            if(!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not Found",
                };
            }
            return {
                ok: true,
                // restaurant,
                // totalResults,
                // totalPages: Math.ceil(totalResults / setPageContetents),
            }
        } catch {
            return {
                ok: false,
                error: "Could not find restaurant",
            };
        }
    };
    async searchRestaurantName(
        {query, page}: SearchRestaurantInput
    ): Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: {
                    name: Raw(name => `${name} Like '%${query}%'`),
                },
                skip: (page - 1) * 2,
                take: 2,
            })
            return {
                ok: true,
                restaurants,
                totalResults,
                totalPages: Math.ceil(totalResults / 2),
            }
        } catch {
            return {
                ok: false,
                error: "Could not search restaurants"
            }
        }
    }

    async myRestaurants(
        owner: User,
    ): Promise<MyRestaurantsOutput> {
        try {
            const restaurants = await this.restaurants.find({owner})
            return {
                ok: true,
                restaurants,
            };
        } catch {
            return {
                ok: false,
                error: "Could not find restaurants."
            };
        }
    }

    async myRestaurant(
        owner: User,
        {id}: MyRestaurantInput
    ): Promise<MyRestaurantOutput> {
        const restaurant = await this.restaurants.findOne({owner, id})
        if(!restaurant) {
            return {
                ok: false,
                error: "Restaurant not found",
            }
        }
        try {
            return {
                ok: true,
                restaurant,
            }
        } catch {
            return {
                ok: false,
                error: "Could not find restaurants.",
            }
        }
    }
}
