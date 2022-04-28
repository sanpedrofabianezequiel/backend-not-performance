import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn,CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';
import { enumType } from '../interfaces/IResponseSubscription';



@Entity()

export class ISubscriptions {

    @PrimaryGeneratedColumn({type:'int'})
    id: number;

    @Column({
        type:"varchar",
    })
    email:  string;

    @Column({
        type: "varchar",length:15
    })
    phone: string;

    @Column({
        type: "varchar",
    })
    type: enumType;
    
    @CreateDateColumn({ 
        type: "datetime" 
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "datetime"
    })
    updated_at: Date;

    @DeleteDateColumn({
        type: "datetime"
    })
    deleted_at: Date;
}


