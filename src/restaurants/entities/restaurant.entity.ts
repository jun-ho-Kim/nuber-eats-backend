import {ObjectType, Field} from "@nestjs/graphql"

@ObjectType()
export class Restaurant {
    @Field(type => String) /* <- 이 타입은 GraphQL를 위한 것 */
    name: string; /* <- 이 타입은 타입스크립트를 위한 것 */
    @Field(type => Boolean, {nullable: true}) 
    isGood?: Boolean;
}
