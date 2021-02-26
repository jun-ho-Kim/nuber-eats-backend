import { CoreEntity } from "src/common/entities/core.entity";
import { Entity, Column, OneToMany } from "../../../node_modules/typeorm";
import { ObjectType, InputType, Field } from "../../../node_modules/@nestjs/graphql";
import { IsString, Length } from "../../../node_modules/class-validator";
import { Restaurant } from "./restaurant.entity";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
    @Field(type => String)
    @Column()
    @IsString()
    @Length(5)
    name: string;

    @Field(type => String)
    @Column()
    @IsString()
    coverImg: string;

    @Field(type => [Restaurant])
    @OneToMany(
        type => Restaurant,
        restaurant => restaurant.category,
    )
    restaurant: Restaurant[];
}