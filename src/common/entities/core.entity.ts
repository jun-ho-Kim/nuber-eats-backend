import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Field } from "@nestjs/graphql";


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