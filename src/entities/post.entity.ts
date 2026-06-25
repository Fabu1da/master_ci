import { Column, CreateDateColumn, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { POST_TITLE_MAX_LENGTH } from "../lib/constant";

import { User } from "./user.entity";

@Entity()
export class Post {
    // Define your entity properties and methods here
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: 'varchar', length: POST_TITLE_MAX_LENGTH })
    title: string;
    @Column({ type: "text" })
    content: string;
    @CreateDateColumn()
    createdAt: Date;
    @ManyToOne(() => User)
    @JoinColumn()
    createdBy: User;
}

