import {Entity,UpdateDateColumn,DeleteDateColumn, Column,PrimaryGeneratedColumn, PrimaryColumn,CreateDateColumn,OneToOne, ManyToMany} from 'typeorm';

export enum enumStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    FINISHED = 'finished',
}
@Entity()
export class IReadingPlans{
    @PrimaryGeneratedColumn({type:'int'})
    id: number;

    @Column({
        type: "varchar"
    })
    name: string;
    
    @Column({
        type:'varchar'
    })
    email: string;
    
    @Column({
        type:"date"
    })
    start_date: Date;
    
    @Column({
        type: "date"
    })
    end_date: Date;
    
    @Column({type:'varchar',length:10})
    next_date: string;
    
    @Column({type:'text'})
    days: string;
    
    @Column({
        type: "int"
    })
    amount_verses_per_day: number;

    @Column({
        type: "enum",
        enum: enumStatus,
    })
    status: enumStatus;
    
    @Column({
        type: "int",
        default: 0,
    })
    amount_days_delivered: number;

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

