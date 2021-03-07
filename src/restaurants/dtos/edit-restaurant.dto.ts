import { InputType, PartialType, ObjectType, Field } from "../../../node_modules/@nestjs/graphql";
import { CreateRestaurantInput } from "./create-restaurant.dto";
import { CoreOutput } from "../../common/dtos/output.dto";


@InputType()
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {

@Field(type => Number)
restraurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}