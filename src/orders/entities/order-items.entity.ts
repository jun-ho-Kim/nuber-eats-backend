import { Dish } from "../../restaurants/entities/dish.entity";
import { Entity, ManyToOne, Column } from "../../../node_modules/typeorm";
import { Field, ObjectType, InputType, Int } from "../../../node_modules/@nestjs/graphql";
import { CoreEntity } from "../../common/entities/core.entity";

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
 /* name은 frontend에서 얻어올 것이다. react와 GraphQL을 이용해서
    여기 있는 이름을 가진 request를 날릴 것이다. 
    그러면 back-end에서는 이것의 extra가 얼마인지 찾아볼 것이다. */
    @Field(type => String)
    name: string

    @Field(type => String, { nullable: true})
    choice: string;
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
    dish: Dish;

    @Field(type => [OrderItemOption], {nullable: true})
    @Column({ type: 'json', nullable: true })
    options?: OrderItemOption[];
}