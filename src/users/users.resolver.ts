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
        try {
            return this.usersService.createAccount(createAccountInput);
            // const {ok, error} = await this.usersService.createAccount(createAccountInput);
            //     return {
            //         ok,
            //         error
            //     }
        } catch(error) {
            return {
                error,
                ok:false
            };
        }
    }
    @Mutation(returns => LoginOutput)
    async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
        try {
            return this.usersService.login(loginInput);
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
    }
    @Query(returns => User)
    @UseGuards(AuthGuard)
    me(@AuthUser() authUser: User) {
        return authUser
    }
    // me(@Context() context) {
    //     if(!context.user){
    //         return false
    //     } else {
    //         return context.user;
    //     }
    // }
    @UseGuards(AuthGuard)
    @Query(returns => UserProfileOutput)
    async userProfile(
        @Args() userProfileInput: UserProfileInput
    ): Promise<UserProfileOutput> {
        try {
            const user = await this.usersService.findById(userProfileInput.userId);
            if(!user) {
                throw Error()
            }
            return {
                ok: true,
                user
            }
        } catch(e) {
            return {
                error: "User Not Found",
                ok: false
            }

        }
    }
    @UseGuards(AuthGuard)
    @Mutation(returns => EditProfileOutput)
    async editProfile(
        @AuthUser() authUser: User,
        @Args('input') editProfileInput: EditProfileInput
    ): Promise<EditProfileOutput> {
        try {
            await this.usersService.editProfile(authUser.id, editProfileInput);
            return {
                ok: true
            }
        } catch(error) {
            return {
                ok: false,
                error,
            }
        }
    }
    @Mutation(returns => VerifyEmailOutput)
    async VerifyEmail(@Args('input') {code}: VerifyEmailInput):Promise<VerifyEmailOutput> {
        try {
            await this.usersService.verifyEmail(code);
            return {
                ok: true
            };
        } catch(error) {
            return {
                error,
                ok: false
            };
        }
    }
}