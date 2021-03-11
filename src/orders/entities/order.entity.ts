import { CoreEntity } from "../../common/entities/core.entity";
import { User } from "../../users/entities/user.entity";
import { Restaurant } from "../../restaurants/entities/restaurant.entity";
import { Dish } from "../../restaurants/entities/dish.entity";
import { Field, InputType, ObjectType, Int, registerEnumType } from "../../../node_modules/@nestjs/graphql";
import { Entity, ManyToOne, JoinTable, ManyToMany, Column } from "../../../node_modules/typeorm";
import { OrderItem } from "./order-items.entity";
import { IsNumber, IsEnum } from "../../../node_modules/class-validator";


export enum OrderStatus {
    Pending = 'Pending',
    Cooking = 'Cooking',
    PickUp = 'PickUp',
    Deliverd = 'Deliverd',
}

registerEnumType(OrderStatus, {name: 'OrderStatus'});

@InputType('OrderInputType', {isAbstract: true})
@ObjectType()
@Entity()
export class Order extends CoreEntity {

@Field(type => User, {nullable: true})
@ManyToOne(
    type => User,
    user => user.orders,
    { onDelete: 'SET NULL', nullable: true}
)
customer: User;

@Field(type => User, {nullable: true})
@ManyToOne(
    type => User,
    user => user.rides,
    { onDelete: 'SET NULL', nullable: true }
)
driver?: User;

@Field(type => Restaurant)
@ManyToOne(
    type => Restaurant,
    restaurant => restaurant.orders,
    { onDelete: 'SET NULL', nullable: true }
)
restaurant: Restaurant;

@Field(type => [OrderItem])
@ManyToMany(
    type => OrderItem
)
@JoinTable()
items: OrderItem[];

@Column({nullable: true})
@Field(type => Int, {nullable: true})
@IsNumber()
total?: number;


@Column({ type: 'enum', enum: OrderStatus })
@Field(type => OrderStatus)
@IsEnum(OrderStatus)
status: OrderStatus;
}