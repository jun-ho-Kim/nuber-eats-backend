import { Field, Int, ObjectType, InputType } from "../../../node_modules/@nestjs/graphql";
import { Column, ManyToOne, RelationId, Entity } from "../../../node_modules/typeorm";
import { IsString, Length, IsNumber } from "../../../node_modules/class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { Restaurant } from "./restaurant.entity";

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field(type => Int)
    @Column()
    @IsNumber()
    price: number;

    @Field(type => String)
    @Column()
    @IsString()
    photo: string;

    @Field(type => String)
    @Column()
    @Length(5, 140)
    description: string;

    @Field(type => Restaurant)
    @ManyToOne(
        type => Restaurant,
        restaurant => restaurant.menu,
        {onDelete: 'CASCADE'}
    ) 
    restaurant: Restaurant;

    @RelationId((dish: Dish) => dish.restaurant)
    restaurantId: number;
};