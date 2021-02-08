import { Entity, Column } from "../../../node_modules/typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';

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
}