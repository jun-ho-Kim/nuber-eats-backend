import { CoreEntity } from "../../common/entities/core.entity";
import { User } from "../../users/entities/user.entity";
import { Restaurant } from "../../restaurants/entities/restaurant.entity";
import { Field, InputType, ObjectType, Int, registerEnumType } from "../../../node_modules/@nestjs/graphql";
import { Entity, ManyToOne, JoinTable, ManyToMany, Column, RelationId } from "../../../node_modules/typeorm";
import { OrderItem } from "./order-items.entity";
import { IsNumber, IsEnum } from "../../../node_modules/class-validator";


export enum OrderStatus {
    Pending = 'Pending',
    Cooking = 'Cooking',
    Cooked = 'Cooked',
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
    { onDelete: 'SET NULL', nullable: true, eager: true }
)
customer: User;

@RelationId((order: Order) => order.customer)
customerId: number;

@Field(type => User, {nullable: true})
@ManyToOne(
    type => User,
    user => user.rides,
    { onDelete: 'SET NULL', nullable: true, eager: true }
)
driver?: User;

@RelationId((order: Order) => order.driver)
driverId: number;

@Field(type => Restaurant, {nullable: true})
@ManyToOne(
    type => Restaurant,
    restaurant => restaurant.orders,
        
)
restaurant?: Restaurant;

@Field(type => [OrderItem])
@ManyToMany(
    type => OrderItem, {eager: true }
)
@JoinTable()
items: OrderItem[];

@Column({nullable: true})
@Field(type => Int, {nullable: true})
@IsNumber()
total?: number;


@Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
@Field(type => OrderStatus)
@IsEnum(OrderStatus)
status: OrderStatus;
}

