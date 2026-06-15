import { inject, injectable } from "inversify";
import { TYPES } from "../lib/types";
import { IUserRepository } from "../repositories/User.repository";
import { User } from "../entities/user.entity";
import { UserMapper } from "../mapper/User.mapper";

export interface IUserService {
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    create(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: number): Promise<void>;
}

@injectable()
export class UserService implements IUserService {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: IUserRepository,
        @inject(TYPES.UserMapper) private userMapper: UserMapper
    ) {}

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findByEmail(email);
    }

    async create(user: User & { confirmPassword: string }): Promise<User> {
        const isPasswordValid = await this.hashConfirmPassword(user);
        if (!isPasswordValid) {
            throw new Error("Password and confirm password do not match.");
        }

        const userToCreate = this.userMapper.toEntity(user);

        return this.userRepository.create(userToCreate);
    }

    async update(user: User): Promise<User> {
        const existingUser = await this.userRepository.findById(user.id);
        if (!existingUser) {
            throw new Error("User not found.");
        }
        const userToUpdate = this.userMapper.toEntity(user);
        return this.userRepository.update(userToUpdate);
    }

    async delete(id: number): Promise<void> {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error("User not found.");
        }
        await this.userRepository.delete(id);
    }

    private async hashConfirmPassword(user: User & { confirmPassword: string }): Promise<boolean> {
        return user.password == user.confirmPassword; 
    }
}
