import { Injectable } from "../../node_modules/@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "../../node_modules/@nestjs/typeorm";
import { Repository } from "../../node_modules/typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";


@Injectable () 
export class UserService {
    //type이 Repository이고 repository type은 user entity가 된다.
    constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

    async createAccount({email, password, role
    }: CreateAccountInput): Promise<{ok:boolean, error?:string}> {
        try {
            const exist = await this.users.findOne({email});
            if(exist) {
                //make error
                return {ok: false, error: 'There is a user with that email already'};
            }
            await this.users.save(this.users.create({email, password, role}));
            return {ok: true};
        } catch (e) {
            return {ok: false, error: 'Couldn`t create account'};
        }
        // check new user
        // create user & hash the passowrd
    }
}