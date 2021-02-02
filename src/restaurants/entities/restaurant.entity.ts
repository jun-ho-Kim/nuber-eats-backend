import {ObjectType, Field} from "@nestjs/graphql"
import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@ObjectType() /* <- GraphQL를 위한 것  */
@Entity() /* <- TypeORM를 위한 것  */
export class Restaurant {
    @PrimaryGeneratedColumn() /* <- 이 타입은 TypeORM를 위한 것  */
    @Field(type => Number) /* <- 이 타입은 GraphQL를 위한 것 */
    id: number; /* <- 이 타입은 타입스크립트를 위한 것 */

    @Field(type => String) /* <- 이 타입은 GraphQL를 위한 것 */
    @Column() /* <- 이 타입은 TypeORM를 위한 것  */
    name: string; /* <- 이 타입은 타입스크립트를 위한 것 */

    @Field(type => Boolean)
    @Column()
    isVegan: Boolean;

    @Field(type => String)
    @Column()
    address: string;

    @Field(type => String)
    @Column()
    ownersName: string;
}
