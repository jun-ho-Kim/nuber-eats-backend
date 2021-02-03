import {ObjectType, Field, InputType} from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsBoolean, IsString, Length } from "../../../node_modules/class-validator";

@InputType({isAbstract : true })
@ObjectType() /* <- GraphQL를 위한 것  */
@Entity() /* <- TypeORM를 위한 것  */
export class Restaurant {
    @PrimaryGeneratedColumn() /* <- 이 타입은 TypeORM를 위한 것  */
    @Field(type => Number) /* <- 이 타입은 GraphQL를 위한 것 */
    id: number; /* <- 이 타입은 타입스크립트를 위한 것 */

    @Field(type => String) /* <- 이 타입은 GraphQL를 위한 것 */
    @Column() /* <- 이 타입은 TypeORM를 위한 것  */
    @IsString()
    @Length(5)
    name: string; /* <- 이 타입은 타입스크립트를 위한 것 */

    @Field(type => Boolean)
    @Column()
    @IsBoolean()
    isVegan: Boolean;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsString()
    ownersName: string;
}
