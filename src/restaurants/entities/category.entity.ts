import { CoreEntity } from "src/common/entities/core.entity";
import { Entity, Column, OneToMany } from "../../../node_modules/typeorm";
import { ObjectType, InputType, Field } from "../../../node_modules/@nestjs/graphql";
import { IsString, Length } from "../../../node_modules/class-validator";
import { Restaurant } from "./restaurant.entity";

@InputType("CategoryInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
    @Field(type => String)
    @Column({ unique: true })
    @IsString()
    @Length(5)
    name: string;

    @Field(type => String, { nullable: true })
    @Column({ nullable: true })
    @IsString()
    coverImg: string;

    @Field(type => String)
    @Column({ unique: true })
    @IsString()
    slug: string;

    @Field(type => [Restaurant], {nullable: true})
    @OneToMany(
        type => Restaurant,
        restaurant => restaurant.category,
    )
    restaurants: Restaurant[];
}