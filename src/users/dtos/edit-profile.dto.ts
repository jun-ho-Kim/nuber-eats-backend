import { PickType, PartialType, InputType, ObjectType } from "../../../node_modules/@nestjs/graphql";
import { User } from "../entities/user.entity";
import { CoreOutput } from "../../common/dtos/output.dto";

@ObjectType()
export class EditProfileOutput extends CoreOutput {}

@InputType()
export class EditProfileInput extends PartialType(
    PickType(User, ['email', 'password'])
) {}