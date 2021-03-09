import { Field, PickType, InputType, Int, ObjectType } from "../../../node_modules/@nestjs/graphql";
import { Dish } from "../entities/dish.entity";
import { CoreOutput } from "../../common/dtos/output.dto";

@InputType()
export class CreateDishInput extends PickType(Dish, [
    'name',
    'price',
    'description',
    'options',
]) {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {}