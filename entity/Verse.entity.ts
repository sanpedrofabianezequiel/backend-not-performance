import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn, OneToOne, ManyToMany,JoinTable} from 'typeorm';
import { IBooks } from './Book.entity';
import { ITopics } from './Topic.entity';


@Entity()
export class IVerses {
    @PrimaryGeneratedColumn({type:'int'})
    id:number;

    @Column({type:"int"})
    book_id:number;

    @Column({type:"int"})
    chapter:number;

    @Column({type:"int"})
    number:number;
    
    @Column({type:"varchar"})
    slug:string;

    
    @Column("text")
    text:string;

    @Column({type:"text"})
    url_image:string;
    
}