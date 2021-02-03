import {ObjectType, Field, InputType} from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IsBoolean, IsOptional, IsString, Length } from "../../../node_modules/class-validator";

//entity 파일 안에 class validator에 의해 validate 되고 있다.
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

    @Field(type => Boolean, {defaultValue: true}) 
    //ㄴ graphql 스키마에서 이 필드의 defaultValue가 true라는 뜻
    @Column({ default: true}) 
    //ㄴ DB에서 이 필드의 defaultValue가 true 라는 뜻
    @IsOptional() 
    //ㄴ validation은 optional이고 만약 value가 있다면 boolean이어야 한다는 뜻(dto를 위한 것들)
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
