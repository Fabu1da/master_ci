import { inject, injectable } from "inversify";
import {Post} from "../entities";
import {DataSource} from "typeorm";
import { TYPES } from "../lib/types";



export interface IPostRepository {
    create(post: Post): Promise<Post>;
    findAll(): Promise<Post[]>;
    findById(id: number): Promise<Post | null>;
}

@injectable()
export class PostRepository implements IPostRepository {

    constructor(
        @inject(TYPES.DB) private dataSource: DataSource
    ) {}

    async create(post: Post): Promise<Post> {
        const savedPost = await this.dataSource.getRepository(Post).save(post);
        return savedPost;
    }

    async findAll(): Promise<Post[]> {
        return await this.dataSource.getRepository(Post).find();
    }

    async findById(id: number): Promise<Post | null> {
        return await this.dataSource.getRepository(Post).findOneBy({ id });
    }
}