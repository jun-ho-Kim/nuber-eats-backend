import { Field, Int, ObjectType, InputType } from "../../../node_modules/@nestjs/graphql";
import { Column, ManyToOne, RelationId, Entity } from "../../../node_modules/typeorm";
import { IsString, Length, IsNumber } from "../../../node_modules/class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { Restaurant } from "./restaurant.entity";

@InputType("DishChoiceInputType", { isAbstract: true })
@ObjectType()
class DishChoice {
    @Field(type => String)
    name: string;
    @Field(type => Int, {nullable: true})
    extra?: number;
}

@InputType("DishOptionInputType", {isAbstract: true})
@ObjectType()
class DishOption {
    @Field(type => String)
    name: string;

    @Field(type => [DishChoice], {nullable: true})
    choices?: DishChoice[];

    @Field(type => Int, {nullable: true})
    extra?: number;
}


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

  @Field(type => String, { nullable: true })
  @Column({ nullable: true })
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
    { onDelete: 'CASCADE' },
  )
  restaurant: Restaurant;

  @RelationId((dish: Dish) => dish.restaurant)
  restaurantId: number;

  @Field(type => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}