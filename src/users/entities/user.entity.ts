import { Entity, Column, BeforeInsert } from "../../../node_modules/typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import * as bcrypt from 'bcrypt';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { InternalServerErrorException } from "../../../node_modules/@nestjs/common";

enum UserRole {
    client,
    Owner,
    Delivery,
}
//graphql에서 온 코드 
registerEnumType(UserRole, {name: 'UserRole'})

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Column()
    @Field(type => String)
    email: string;

    @Column()
    @Field(type => String)
    password: string;

    @Column({type: 'enum', enum: UserRole})
    @Field(type => UserRole)
    role: UserRole;

    @BeforeInsert()
    async hashPassword(): Promise<void> {
        try {
            this.password = await bcrypt.hash(this.password, 10);
        } catch(e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }
}
