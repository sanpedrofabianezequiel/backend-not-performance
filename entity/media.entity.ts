import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn,CreateDateColumn,OneToOne, ManyToMany, UpdateDateColumn, DeleteDateColumn} from 'typeorm';

@Entity()
export class IMediaItems{

    @PrimaryGeneratedColumn({type:'int'})
    id: number

    @Column({
        type:"text"
    })
    name: string;

    @Column({
        type:"text"
    })
    description: string;
    
    @Column({
        type: "tinytext"
    })
    type: string;
    
    @Column({
        type: "int",default:0
    })
    height:number
    
    @Column({
        type: "int",default:0
    })
    width:number
    
    @Column({
        type: "int",default:0
    })
    size: number;
    
    @Column({
        type:"text"
    })
    url: string;
    
    @CreateDateColumn({ 
        type: "datetime" 
    })
    created_at: Date;

    @UpdateDateColumn({ type:'datetime'})
    updated_at:Date

    @DeleteDateColumn({type:'datetime'})
    deleted_at:Date;
}

    
