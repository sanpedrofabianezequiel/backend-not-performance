import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn,CreateDateColumn,OneToOne, ManyToMany,UpdateDateColumn,DeleteDateColumn} from 'typeorm';
import { IVerses } from './Verse.entity';


@Entity()
export class IDailys {
        @PrimaryGeneratedColumn({type:'int'})
        id: number;

        @PrimaryColumn ({
            type: "int",
            unique: true,
            })
        verse_id: number

        @Column ({
            type:"date"
        })
        date: Date;
        
        @Column({
            type: "tinyint",default:null
        })
        autoposted: number
        
        @CreateDateColumn({ 
            type: "datetime"
        })
        created_at: Date;

        @UpdateDateColumn({
            type:'datetime'
        })
        updated_at:Date;
    
        @DeleteDateColumn({
            type:'datetime'
        })
        deleted_at:Date;

}


