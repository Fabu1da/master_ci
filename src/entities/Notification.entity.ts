import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(["userId", "postId"])
export class Notification {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int" })
    userId!: number;

    @Column({ type: "int" })
    postId!: number;

    @Column({ type: "varchar" })
    message!: string;

    @Column({ type: "boolean", default: false })
    read!: boolean;

    @CreateDateColumn()
    createdAt!: Date;
}