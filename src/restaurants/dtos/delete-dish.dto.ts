import { Int, Field, InputType, ObjectType } from "../../../node_modules/@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/output.dto";

@InputType()
export class DeleteDishInput {
    @Field(type => Int)
    dishId: number;
}

@ObjectType()
export class DeleteDishOutput extends CoreOutput {}