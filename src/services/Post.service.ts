
import { inject, injectable } from "inversify";
import { IPostRepository } from "../repositories/Post.repository";
import { Post } from "../entities";
import { TYPES } from "../lib/types";
import { IPostMapper } from "../mapper/Post.mapper";

export interface IPostService {
    createPost(post: Post): Promise<Post>;
    getAllPosts(): Promise<Post[]>;
    getPostById(id: number): Promise<Post>;
}

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject(TYPES.PostRepository) private _postRepository: IPostRepository,
        @inject(TYPES.PostMapper) private _postMapper: IPostMapper
    ) {}
    // Implement your service methods here
    async createPost(post:Post): Promise<Post> {
        if (!post.title || !post.content || !post.createdBy) {
            throw new Error("Title, content, and createdBy are required");
        }
        return this._postRepository.create(post);
    }
    async getAllPosts(): Promise<Post[]> {
        return this._postRepository.findAll();
    }
    async getPostById(id: number): Promise<Post> {
        const post = await this._postRepository.findById(id);
        if (!post) {
            throw new Error("Post not found");
        }
        return post;
    }
}