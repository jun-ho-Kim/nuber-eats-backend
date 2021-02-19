import { ObjectType, InputType, PickType } from "../../../node_modules/@nestjs/graphql";
import { CoreOutput } from "../../common/dtos/output.dto";
import { Verification } from "../entities/verification.entity";


@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) {}