import { Entity, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import { CoreEntity } from "../../common/entities/core.entity";
import * as bcrypt from 'bcrypt';
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql';
import { InternalServerErrorException } from "@nestjs/common";
import { IsEmail, IsEnum, IsString, IsBoolean } from "class-validator";
import { Restaurant } from "../../restaurants/entities/restaurant.entity";

export enum UserRole {
    Client = 'Client',
    Owner = 'Owner',
    Delivery = 'Delivery',
}
//graphql에서 온 코드 
registerEnumType(UserRole, {name: 'UserRole'})

@InputType("UserInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Column()
    @Field(type => String)
    @IsEmail()
    email: string;

    @Column({ select: false })
    @Field(type => String)
    @IsString()
    password: string;

    @Column({type: 'enum', enum: UserRole})
    @Field(type => UserRole)
    @IsEnum(UserRole)
    role: UserRole;

    @Column({ default: false })
    @IsBoolean()
    @Field(type => Boolean)
    verified: boolean;

    @Field(type => [Restaurant])
    @OneToMany(
        type => Restaurant,
        restaurant => restaurant.owner,
    )
    restaurants: Restaurant[];


    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if(this.password) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch(e) {
                console.log(e);
                throw new InternalServerErrorException();
            }
        }

    }

    async checkPassword(aPassword: string): Promise<boolean> {
        try {
            const ok = await bcrypt.compare(aPassword, this.password);
            return ok;
        } catch(error) {
            throw new InternalServerErrorException();
        }
    }
}
