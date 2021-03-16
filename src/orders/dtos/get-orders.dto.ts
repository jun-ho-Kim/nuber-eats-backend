import { OrderStatus, Order } from "../entities/order.entity";
import { Field, InputType, ObjectType } from "../../../node_modules/@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/output.dto";

@InputType()
export class GetOrdersInput {
    @Field(type => OrderStatus, { nullable: true })
    status?: OrderStatus;
}

@ObjectType()
export class GetOrdersOutput extends CoreOutput {
    @Field(type => [Order], { nullable: true })
    orders?: Order[];
}