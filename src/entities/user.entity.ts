import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar' })
    email: string;
    @Column({ type: 'varchar' })
    lastName: string;
    @Column({ type: 'varchar' })
    firstName: string;
    @Column({ type: 'varchar' })
    password: string;
    @CreateDateColumn()
    createdAt: Date


}