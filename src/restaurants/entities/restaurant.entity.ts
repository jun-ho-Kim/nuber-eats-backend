import {ObjectType, Field, InputType} from "@nestjs/graphql"
import { Entity, Column, ManyToOne, RelationId, OneToMany } from "typeorm";
import { IsString, Length } from "class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { Category } from "./category.entity";
import { User } from "../../users/entities/user.entity";
import { Dish } from "./dish.entity";
import { Order } from "../../orders/order.entity";

//entity 파일 안에 class validator에 의해 validate 되고 있다.
@InputType("RestaurantInputType", {isAbstract : true })
@ObjectType() /* <- GraphQL를 위한 것  */
@Entity() /* <- TypeORM를 위한 것  */
export class Restaurant extends CoreEntity {
    @Field(type => String) /* <- 이 타입은 GraphQL를 위한 것 */
    @Column() /* <- 이 타입은 TypeORM를 위한 것  */
    @IsString()
    @Length(5)
    name: string; /* <- 이 타입은 타입스크립트를 위한 것 */

    @Field(type => String)
    @Column()
    @IsString()
    coverImg: string;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => Category, {nullable: true})
    @ManyToOne(
        type => Category,
        category => category.restaurants,
        { nullable: true, onDelete: 'SET NULL' },
    )
    category: Category;

    @Field(type => User)
    @ManyToOne(
        type => User,
        user => user.restaurants,
        { onDelete: 'CASCADE'}
    )
    owner: User;

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    ownerId: number;

    @Field(type => [Dish])
    @OneToMany(
        type => Dish,
        dish => dish.restaurant,
    )
    menu: Dish[];

    @Field(type => [Order])
    @OneToMany(
        type => Order,
        order => order.restaurant,
    )
    orders: Order[];
};
