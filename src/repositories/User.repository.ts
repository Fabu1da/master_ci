import { DataSource } from "typeorm";
import { inject, injectable } from "inversify";
import { TYPES } from "../lib/types";
import { User } from "../entities/user.entity";


export interface IUserRepository {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<void>;
}

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(TYPES.DB) private dataSource: DataSource
    ) {}

    async findById(id: number): Promise<User | null> {
        return await this.dataSource.getRepository(User).findOneBy({ id });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.dataSource.getRepository(User).findOneBy({ email });
    }

    async create(user: User): Promise<User> {
        const savedUser = await this.dataSource.getRepository(User).save(user);
        return savedUser;
    }

    async update(user: User): Promise<User> {
        const updatedUser = await this.dataSource.getRepository(User).save(user);
        return updatedUser;
    }

    async delete(id: number): Promise<void> {
        await this.dataSource.getRepository(User).delete(id);
    }
}