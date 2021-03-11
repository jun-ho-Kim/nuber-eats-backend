import { PickType, InputType, Field, Int, ObjectType } from "../../../node_modules/@nestjs/graphql";
import { Order } from "../entities/order.entity";
import { CoreOutput } from "../../common/dtos/output.dto";


@InputType()
export class CreateOrderInput extends PickType(Order, ['items']) {
    @Field(type => Int)
    restaurantId: number;
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}