import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PaginationOutput } from "src/common/dtos/pagination.dto";
import { Restaurant } from "../entities/restaurant.entity";

@InputType()
export class RestaurantInput extends PaginationInput {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class RestaurantOutput extends PaginationOutput {
    @Field(type => Restaurant, {nullable: true})
    restaurant?: Restaurant
}