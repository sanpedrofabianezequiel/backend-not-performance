import {Entity,UpdateDateColumn,DeleteDateColumn, Column,PrimaryGeneratedColumn, PrimaryColumn,CreateDateColumn,OneToOne, ManyToMany} from 'typeorm';

@Entity()
export class IContact {
    @PrimaryGeneratedColumn({type:'int'})
    id: Number;

    
    @Column({
        type: "varchar"
    })
    name: String;
    
    @Column({
        type:"varchar"
    })
    email:String;
    
    @Column({
        type:"text"
    })
    message: String
    
    @Column()
    phone: String;
        
    @CreateDateColumn({ 
        type: "timestamp" 
    })
    created_at: Date;

    @UpdateDateColumn({
        type: "timestamp"
    })
    update_at: Date;

    @DeleteDateColumn({
        type: "timestamp"
    })
    delete_at: Date;

 
}