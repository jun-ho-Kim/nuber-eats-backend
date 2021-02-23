import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAccountInput, CreateAccountOutput } from "./dtos/create-account.dto";
import { LoginInput, LoginOutput} from "./dtos/login.dto";
import { JwtService } from "../jwt/jwt.service";
import { EditProfileInput, EditProfileOutput } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";
import { VerifyEmailOutput } from "./dtos/verify-email.dto";
import { UserProfileOutput } from "./dtos/user-profile.dto";
import { MailService } from "../mail/mail.service";


@Injectable () 
export class UserService {
    //type이 Repository이고 repository type은 user entity가 된다.
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly mailService: MailService,
        private readonly jwtService: JwtService,
        
    ) {}

    async createAccount({email, password, role
    }: CreateAccountInput): Promise<CreateAccountOutput> {
        try {
            const exist = await this.users.findOne({email});
            console.log("exist", exist);
            if(exist) {
                //make error
                return {ok: false, error: 'There is a user with that email already'};
            }
            const user = await this.users.save(this.users.create({email, password, role}));
            const verification = await this.verifications.save(
                this.verifications.create({
                    user
                }),
            );
            this.mailService.sendVerificationEmail(user.email, verification.code)
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
        : LoginInput): Promise<LoginOutput> {
        try {
            const user = await this.users.findOne(
                {email},
                {select: ['id', 'password']});
            console.log("login user", user, "user.id");
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
    async findById(id: number): Promise<UserProfileOutput> {
        try {
            const user = await this.users.findOne({id});
            if(user) {
                return {
                    ok: true,
                    user
                }
            }
        } catch(error) {
            return {
                error,
                ok: false
            }

        }
        
    }
    async editProfile(userId: number, {email, password}: EditProfileInput
    ): Promise<EditProfileOutput> {
        try {
            const user = await this.users.findOne(userId);
            if(email) {
               user.email = email;
               user.verified = false;
               const verification = await this.verifications.save(this.verifications.create({user}));
                this.mailService.sendVerificationEmail(user.email, verification.code);
            }
            if(password) {
                user.password = password
            }
            await this.users.save(user);
            return {
                ok: true,
            }
        } catch(error) {
            return {
                ok: false,
                error: 'Could not update profile'
            }
        }
    }
    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        const verification = await this.verifications.findOne(
            {code},
            {relations: ['user']})
        try {
            if(verification) {
                verification.user.verified = true;
                await this.users.save(verification.user);
                await this.verifications.delete(verification.id);
            }
            return {ok: true};
            return { ok: false, error: 'Verification not found.' };
        } catch(error) {
            return {ok: false, error};
        }
    } 
}