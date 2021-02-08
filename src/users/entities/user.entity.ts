import { Entity, Column } from "../../../node_modules/typeorm";
import { CoreEntity } from "../../common/entities/core.entity";

type UserRole = 'client' | 'owner' | 'delivery';

@Entity()
export class User extends CoreEntity {
    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    role: UserRole;

}