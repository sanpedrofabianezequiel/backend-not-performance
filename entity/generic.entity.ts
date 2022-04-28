import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn} from 'typeorm';

export enum ETestament{
    OT="OT",
    NT="NT"
}


@Entity()
export class IGeneric {
    //BOOK
    @PrimaryGeneratedColumn({type:'int'})
    id:number;
    
    @Column({type:'text'})
    generic:string;
}