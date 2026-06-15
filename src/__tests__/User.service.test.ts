import "reflect-metadata";
import { UserMapper } from "../mapper/User.mapper";
import { IUserRepository } from "../repositories/User.repository";
import { UserService } from "../services/User.service";
import { User } from "../entities/user.entity";
import { UserDTO } from "../dtos/user.Dto";

describe("UserService Tests", () => {

    let userService: UserService;
    let mockUserRepository :jest.Mocked<IUserRepository>;
    let mockUserMapper: jest.Mocked<UserMapper>;

    beforeEach(() => {
        mockUserRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockUserMapper = {
            toEntity: jest.fn(),
            toDto: jest.fn()
        } as jest.Mocked<UserMapper>;

        userService = new UserService(mockUserRepository, mockUserMapper);
    });

    it("should create a user when passwords match", async () => {
        const user = new User();
        user.email = "test@example.com";
        user.firstName = "Test";
        user.lastName = "User";
        user.password = "secret";

        const userWithConfirm = Object.assign({}, user, { confirmPassword: "secret" });

        mockUserMapper.toEntity.mockReturnValue(user);
        mockUserRepository.create.mockResolvedValue(user);

        const result = await userService.create(userWithConfirm as UserDTO & { confirmPassword: string });

        expect(mockUserMapper.toEntity).toHaveBeenCalledWith(userWithConfirm);
        expect(mockUserRepository.create).toHaveBeenCalledWith(user);
        expect(result).toBe(user);
    });

    it("should throw when create called with mismatched passwords", async () => {
        const user = new User();
        user.password = "a";
        const userWithConfirm = Object.assign({}, user, { confirmPassword: "b" });

        await expect(userService.create(userWithConfirm as UserDTO & { confirmPassword: string })).rejects.toThrow("Password and confirm password do not match.");
    });

    it("should find user by id", async () => {
        const user = new User();
        user.id = 5;

        mockUserRepository.findById.mockResolvedValue(user);

        const result = await userService.findById(5);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(5);
        expect(result).toBe(user);
    });

    it("should find user by email", async () => {
        const user = new User();
        user.email = "someone@example.com";

        mockUserRepository.findByEmail.mockResolvedValue(user);

        const result = await userService.findByEmail("someone@example.com");

        expect(mockUserRepository.findByEmail).toHaveBeenCalledWith("someone@example.com");
        expect(result).toBe(user);
    });

    it("should update existing user", async () => {
        const user = new User();
        user.id = 10;
        user.email = "u@example.com";

        mockUserRepository.findById.mockResolvedValue(user);
        mockUserMapper.toEntity.mockReturnValue(user);
        mockUserRepository.update.mockResolvedValue(user);

        const result = await userService.update(user);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(10);
        expect(mockUserMapper.toEntity).toHaveBeenCalledWith(user);
        expect(mockUserRepository.update).toHaveBeenCalledWith(user);
        expect(result).toBe(user);
    });

    it("should throw when updating non-existing user", async () => {
        const user = new User();
        user.id = 99;

        mockUserRepository.findById.mockResolvedValue(null);

        await expect(userService.update(user)).rejects.toThrow("User not found.");
    });

    it("should delete existing user", async () => {
        const user = new User();
        user.id = 3;

        mockUserRepository.findById.mockResolvedValue(user);
        mockUserRepository.delete.mockResolvedValue(undefined);

        await userService.delete(3);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(3);
        expect(mockUserRepository.delete).toHaveBeenCalledWith(3);
    });

    it("should throw when deleting non-existing user", async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(userService.delete(123)).rejects.toThrow("User not found.");
    });

});
