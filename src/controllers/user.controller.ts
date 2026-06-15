import { controller, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { User } from "../entities/user.entity";
import { inject } from "inversify";
import { TYPES } from "../lib/types";

export interface IUserController {
    getUserById(id: number): Promise<User | null>;
    createUser(user: User): Promise<User>;
    updateUser(id: number, user: User): Promise<User>;
    deleteUser(id: number): Promise<void>;
}

@controller("/users")
export class UserController implements IUserController {
    constructor(
       @inject(TYPES.UserService) private userService: IUserController
    ) {}
    
    @httpGet("/:id")
    public async getUserById(id: number): Promise<User | null> {
        return this.userService.getUserById(id);
    }
    // Implement other methods (createUser, updateUser, deleteUser) similarly
    @httpPost("/create")
    public async createUser(user: User): Promise<User> {
        return this.userService.createUser(user);
    }

    @httpPut("/update/:id")
    public async updateUser(id: number, user: User): Promise<User> {
        return this.userService.updateUser(id, user);
    }

    @httpGet("/delete/:id")
    public async deleteUser(id: number): Promise<void> {
        await this.userService.deleteUser(id);
    }
}