import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CoreEntity {
    @PrimaryGeneratedColumn()
    @Field(type => String)
    id: number;

    @CreateDateColumn()
    @Field(type => Date)
    createdAt: Date;

    @UpdateDateColumn()
    @Field(type => Date)
    updateAt: Date;
}