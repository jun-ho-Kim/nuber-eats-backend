import { Resolver, Query } from "../../node_modules/@nestjs/graphql";
import { UserService } from "./users.service";
import { User } from "./entities/user.entity";



@Resolver(of => User)
export class UserResolver {
    constructor(private readonly usersService: UserService) {}
    @Query(returns => Boolean)
    hi() {
        return true;
    }    
}
