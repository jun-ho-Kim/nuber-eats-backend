import { v4 as uuidv4 } from 'uuid';
import { CoreEntity } from "../../common/entities/core.entity";
import { Entity, Column, OneToOne, JoinColumn, BeforeInsert } from "../../../node_modules/typeorm";
import { ObjectType, Field, InputType } from "../../../node_modules/@nestjs/graphql";
import { User } from "./user.entity";

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
    @Column()
    @Field(type => String)
    code: string;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;

    @BeforeInsert()
    createCode(): void {
        this.code= uuidv4()
    }


}