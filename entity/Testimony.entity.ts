import {Entity,Column,PrimaryGeneratedColumn, PrimaryColumn,CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';

export enum TestimonyStatus {
    PENDING = "pending",
    APPROVED = "approved",
}

@Entity()
export class ITestimonies {
     @PrimaryGeneratedColumn({type:'int'})
    id: number;

    @Column({
        type: "text"
    })
    title: string;

    @Column({
        type:"text"
    })
    content: string;

    @Column({
        type: "text",
    })
    tag: string;

    @Column({
        type: "enum",
        enum: TestimonyStatus,
        default: TestimonyStatus.PENDING
    })
    status: TestimonyStatus

    @Column({
        type: "varchar",
    })
    created_by: string;

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

