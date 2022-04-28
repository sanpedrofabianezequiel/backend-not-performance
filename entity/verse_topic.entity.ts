import {Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, CreateDateColumn, OneToMany, OneToOne,ManyToMany,ManyToOne,JoinTable} from "typeorm"
import { IVerses } from './Verse.entity';
import { ITopics } from './Topic.entity';

@Entity()
export class IVersesHaveTopics{
    @PrimaryGeneratedColumn({type:'int'})
    id: number;
    
    @Column({type: "int"})
    verse_id: number;

    @Column({type: "int"})
    topic_id: number;
}
