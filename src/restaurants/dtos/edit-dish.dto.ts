import { PartialType, PickType, Int, Field, ObjectType, InputType } from "@nestjs/graphql";
import { Dish } from "../entities/dish.entity";
import { CoreOutput } from "../../common/dtos/output.dto";

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
    'name',
    'options',
    'price',
    'description',
]) {
    @Field(type => Int)
    dishId: number;
}

@ObjectType()
export class EditDishOutput extends CoreOutput {}