import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn,CreateDateColumn,OneToOne, ManyToMany, UpdateDateColumn, DeleteDateColumn} from 'typeorm';

@Entity()
export class IDailyVerseConfig {

    @PrimaryGeneratedColumn({
        type: "int",
    })
    id: number;

    @Column({
        type: "int",
        unique: true
    })
    current_verse_id:number;
    
    @Column({
        type: "int"
    })
    qty_to_show: number;

    @CreateDateColumn({ 
        type: "datetime",default:null
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