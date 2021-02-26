import {ObjectType, Field, InputType} from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { CoreEntity } from "../../common/entities/core.entity";
import { Category } from "./category.entity";

//entity 파일 안에 class validator에 의해 validate 되고 있다.
@InputType({isAbstract : true })
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

    @Field(type => Category)
    @ManyToOne(
        type => Category,
        category => category.restaurant
    )
    category: Category;

    @Field(type => String)
    @Column()
    @IsString()
    ownersName: string;
}
