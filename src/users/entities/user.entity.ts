import { Entity, Column } from "../../../node_modules/typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import { Field, InputType, ObjectType } from '@nestjs/graphql';

type UserRole = 'client' | 'owner' | 'delivery';

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

    @Column()
    @Field(type => String)
    role: UserRole;
}