import { CoreOutput } from "../../common/dtos/output.dto";
import { User } from "../entities/user.entity";
import { Field, ObjectType, ArgsType } from "@nestjs/graphql";

@ArgsType()
export class UserProfileInput {
    @Field(type => Number)
    userId: number;
}

@ObjectType()
export class UserProfileOutput extends CoreOutput {
    @Field(type => User, {nullable: true})
    user?: User;
}