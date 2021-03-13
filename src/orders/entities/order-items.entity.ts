import { Dish, DishOption } from "../../restaurants/entities/dish.entity";
import { Entity, ManyToOne, Column } from "../../../node_modules/typeorm";
import { Field, ObjectType, InputType, Int } from "../../../node_modules/@nestjs/graphql";
import { CoreEntity } from "../../common/entities/core.entity";

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
    @Field(type => String)
    name: string

    @Field(type => String, { nullable: true})
    choice: string;

    @Field(type => Int, { nullable: true })
    extra?: number;
}


@InputType('OrderItemInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
    @Field(type => Dish)
    @ManyToOne(
        type => Dish,
        { nullable: true, onDelete: 'CASCADE'}
    )
    dish: Dish[];

    @Field(type => [OrderItemOption], {nullable: true})
    @Column({ type: 'json', nullable: true })
    options?: OrderItemOption[];
}