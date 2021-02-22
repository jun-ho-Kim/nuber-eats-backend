import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateAccountOutput, CreateAccountInput } from "./dtos/create-account.dto";
import { LoginOutput, LoginInput } from "./dtos/login.dto";
import { UseGuards } from "../../node_modules/@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { AuthUser } from "../auth/auth-user.decorator";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { VerifyEmailOutput, VerifyEmailInput } from "./dtos/verify-email.dto";



@Resolver(of => User)
export class UserResolver {
    constructor(private readonly usersService: UserService) {}

    @Mutation(returns => CreateAccountOutput)
    async createAccount(@Args('input') createAccountInput: CreateAccountInput): 
    Promise<CreateAccountOutput>  {
        return this.usersService.createAccount(createAccountInput);
    }

    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        return this.usersService.login(loginInput);
    }

    @Query(returns => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User) {
        return authUser
    }

    @UseGuards(AuthGuard)
    @Query(returns => UserProfileOutput)
    async userProfile(
        @Args() userProfileInput: UserProfileInput
    ): Promise<UserProfileOutput> {
        return this.usersService.findById(userProfileInput.userId);
    }

    @Mutation(returns => EditProfileOutput)
    @UseGuards(AuthGuard)
    async editProfile(
        @AuthUser() authUser: User,
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<EditProfileOutput> {
        return this.usersService.editProfile(authUser.id, editProfileInput);
    }
    
    @Mutation(returns => VerifyEmailOutput)
    VerifyEmail(@Args('input') {code}: VerifyEmailInput):Promise<VerifyEmailOutput> {
        return this.usersService.verifyEmail(code);
    }
}