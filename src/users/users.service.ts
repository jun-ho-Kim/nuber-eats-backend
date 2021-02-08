import { Injectable } from "../../node_modules/@nestjs/common";
import { User } from "./entities/user.entity";
import { InjectRepository } from "../../node_modules/@nestjs/typeorm";
import { Repository } from "../../node_modules/typeorm";


@Injectable () 
export class UserService {
    //type이 Repository이고 repository type은 user entity가 된다.
    constructor(@InjectRepository(User) private readonly users: Repository<User>) {}
}