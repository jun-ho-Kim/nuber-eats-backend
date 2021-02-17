import { Resolver, Query, Args, Mutation, Context } from "@nestjs/graphql";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateAccountOutput, CreateAccountInput } from "./dtos/create-account.dto";
import { LoginOutput, LoginInput } from "./dtos/login.dto";
import { UseGuards } from "../../node_modules/@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";



@Resolver(of => User)
export class UserResolver {
    constructor(private readonly usersService: UserService) {}
    @Query(returns => Boolean)
    hi() {
        return true;
    }    

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
    me(@Context() context) {
        if(!context.user){
            return false
        } else {
            return context.user;
        }
    }
}
