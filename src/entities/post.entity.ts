import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { POST_TITLE_MAX_LENGTH } from "../lib/constant";

@Entity()
export class Post {
    // Define your entity properties and methods here
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ length: POST_TITLE_MAX_LENGTH })
    title: string;
    @Column({ type: "text" })
    content: string;
    @CreateDateColumn()
    createdAt: Date;
    @Column()
    createdBy: number;
}

