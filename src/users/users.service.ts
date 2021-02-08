import { Injectable } from "../../node_modules/@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "../../node_modules/@nestjs/typeorm";
import { Repository } from "../../node_modules/typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";


@Injectable () 
export class UserService {
    //type이 Repository이고 repository type은 user entity가 된다.
    constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

    async createAccount({email, password, role}: CreateAccountInput) {
        try {
            const exist = await this.users.findOne({email});
            if(exist) {
                //make error
                return;
            }
            await this.users.save(this.users.create({email, password, role}));
            return true;
        } catch (e) {
            return;
        }
        // check new user
        // create user & hash the passowrd
    }
}