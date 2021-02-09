import { Resolver, Query, Args, Mutation } from "../../node_modules/@nestjs/graphql";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";
import { CreateAccountOutput, CreateAccountInput } from "./dtos/create-account.dto";



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
            const {ok, error} = await this.usersService.createAccount(createAccountInput);
                return {
                    ok,
                    error
                }
        } catch(error) {
            return {
                error,
                ok:false
            };
        }
    }
}
