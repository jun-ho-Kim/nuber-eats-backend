import { Dish, DishOption } from "../../restaurants/entities/dish.entity";
import { Entity, ManyToOne, Column } from "../../../node_modules/typeorm";
import { Field, ObjectType, InputType } from "../../../node_modules/@nestjs/graphql";
import { CoreEntity } from "../../common/entities/core.entity";

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

    @Field(type => [DishOption], {nullable: true})
    @Column({ type: 'json', nullable: true })
    options?: DishOption[];
}