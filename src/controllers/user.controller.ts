import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { Request, Response } from "express";
import { inject } from "inversify";
import { TYPES } from "../lib/types";
import { IUserService } from "../services/User.service";
import { User } from "../entities";

export interface IUserController {
    getUserById(req:Request, res:Response): Promise<Response>;
    createUser(req:Request, res:Response): Promise<Response>;
    updateUser(req:Request, res:Response): Promise<Response>;
    deleteUser(req:Request, res:Response): Promise<Response>;
}

@controller("/users")
export class UserController implements IUserController {
    constructor(
       @inject(TYPES.UserService) public userService: IUserService
    ) {}

    @httpGet("/")
    public async getAllUsers(req: Request, res: Response): Promise<Response> {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching users:", error);
            return res.status(500).json({ error: "Failed to fetch users" });
        }
    }
    
    @httpGet("/:id")
    public async getUserById(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        const user = await this.userService.findById(id);
        return res.json(user);
    }

    @httpPost("/create")
    public async createUser(req: Request, res: Response): Promise<Response> {
        try {
            const { email, firstName, lastName, password, confirmPassword } = req.body || {};
            
            if (!email || !firstName || !lastName || !password || !confirmPassword) {
                return res.status(400).json({ error: "email, firstName, lastName, password, and confirmPassword are required" });
            }

            const user = req.body as User & { confirmPassword: string };
            const newUser = await this.userService.create(user);
            return res.status(201).json(newUser);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ error: error.message || "Failed to create user" });
        }
    }

    @httpPut("/update/:id")
    public async updateUser(req: Request, res: Response): Promise<Response> {
        const user = req.body as User;
        const updatedUser = await this.userService.update(user);
        return res.json(updatedUser);
    }

    @httpDelete("/delete/:id")
    public async deleteUser(req: Request, res: Response): Promise<Response> {
        const id = Number(req.params.id);
        await this.userService.delete(id);
        return res.status(204).send("User deleted successfully");
    }
}