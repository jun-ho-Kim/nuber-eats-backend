import { InputType, PickType, ObjectType, Field } from "../../../node_modules/@nestjs/graphql";
import { User } from "../entities/user.entity";

@InputType()
export class CreateAccountInput extends PickType(User, [
    'email',
    'password',
    'role'
]) {}

@ObjectType()
export class CreateAccountOutput {
    @Field(type => String, {nullable: true} )
    error: string;

    @Field(type => Boolean)
    ok: boolean;
}