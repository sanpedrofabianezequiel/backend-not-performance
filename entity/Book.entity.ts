import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn} from 'typeorm';

export enum ETestament{
    OT="OT",
    NT="NT"
}


@Entity()
export class IBooks {
    @PrimaryGeneratedColumn({type:'int'})
    id:number;

    @PrimaryColumn({type:"int",unique:true})
    number:number;
    
    @Column("text")
    name?:string;
    
    @Column({type:"varchar",length:"2"})
    testament:ETestament;
    
    @Column({type:"varchar",length:"191"})
    slug:string;

    @Column({type:'bigint'})
    number_chapters:number;
}