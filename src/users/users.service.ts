import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as jwt from "jsonwebtoken"
import { CreateAccountInput } from "./dtos/create-account.dto";
import { LoginInput} from "./dtos/login.dto";
import { ConfigService } from "../../node_modules/@nestjs/config";
import { JwtService } from "../jwt/jwt.service";
import { EditProfileInput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";


@Injectable () 
export class UserService {
    //type이 Repository이고 repository type은 user entity가 된다.
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService,
        
    ) {
        // this.jwtService.hello()
    }

    async createAccount({email, password, role
    }: CreateAccountInput): Promise<{ok:boolean, error?:string}> {
        try {
            const exist = await this.users.findOne({email});
            if(exist) {
                //make error
                return {ok: false, error: 'There is a user with that email already'};
            }
            const user = await this.users.save(this.users.create({email, password, role}));
            await this.verifications.save(
                this.verifications.create({
                    user
                }),
            )
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
            const token = this.jwtService.sign(user.id);
            return {
                ok: true,
                token
            };
        } catch(error) {
            return {
                ok: false,
                error: 'User not found'
            };
        }
    }
    async findById(id: number): Promise<User> {
        return this.users.findOne({id});
    }
    async editProfile(userId: number, {email, password}: EditProfileInput) {
        const user = await this.users.findOne(userId);
        if(email) {
           user.email = email;
           user.verified = false;
           await this.verifications.save(this.verifications.create({user}));
        }
        if(password) {
            user.password = password
        }
        return this.users.save(user);
    }
}