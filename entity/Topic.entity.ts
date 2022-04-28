import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn, OneToOne, ManyToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';
import { IVerses } from './Verse.entity';


@Entity()
export class ITopics {
     @PrimaryGeneratedColumn({type:'int'})
    id:number;

    @Column({type:"varchar",length:50})
    name:string;

    @Column({type:"varchar",length:70})
    slug:string;

    
    @Column({type:"text"})
    description?:string;
    
    
    @Column({type:"text"})
    url_image:string;
    
    @Column({type:"tinyint",default:1})
    enabled: number;

    @CreateDateColumn({ 
        type: "datetime" 
    })
    created_at?: Date;  

    @UpdateDateColumn({
        type:'datetime'
    })
    updated_at?:Date;

    @DeleteDateColumn({
        type:'datetime'
    })
    deleted_at?:Date;
    
}