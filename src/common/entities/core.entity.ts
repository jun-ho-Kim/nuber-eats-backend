import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "../../../node_modules/typeorm";


export class CoreEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updateAt: Date;
}