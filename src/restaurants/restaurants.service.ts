import { Injectable } from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from "./entities/restaurant.entity";
import { Repository } from "typeorm";
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { User } from "../users/entities/user.entity";
import { Category } from "./entities/category.entity";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto";
import { CategoryRepository } from "./repository/category.repository";
import { CreateDishInput, CreateDishOutput } from "./dtos/create-dish.dto";
import { Dish } from "./entities/dish.entity";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";


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
                ok: false,
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
}
