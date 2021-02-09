import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput } from "./dtos/login.dto";


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

    async login({
        email, 
        password}
        : LoginInput): Promise<{ok: boolean, error?: string, token?: string}> {
        try {
            const user = await this.users.findOne({email});
            if(!user) {
                return {
                    ok: false,
                    error: 'User not Found'
                };
            }
            const passwordCorrect = await user.checkPassword(password);
            if(!passwordCorrect) {
                return {
                    ok: false,
                    error: 'Wrong password'
                };
            }
            return {
                ok: true,
                token: 'laaaala'
            };
        } catch(error) {
            return {
                ok: false,
                error: 'User not found'
            };
        }
    }
}