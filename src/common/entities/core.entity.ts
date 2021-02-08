import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "../../../node_modules/typeorm";
import { Field } from "../../../node_modules/@nestjs/graphql";


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