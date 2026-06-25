
import { inject, injectable } from "inversify";
import { IPostRepository } from "../repositories/Post.repository";
import { Post } from "../entities";
import { TYPES } from "../lib/types";
import { IPostMapper } from "../mapper/Post.mapper";
import { Producer } from "kafkajs";

export interface IPostService {
    createPost(post: Post): Promise<Post>;
    getAllPosts(): Promise<Post[]>;
    getPostById(id: number): Promise<Post>;
}

@injectable()
export class PostService implements IPostService {
    constructor(
        @inject(TYPES.PostRepository) private _postRepository: IPostRepository,
        @inject(TYPES.PostMapper) private _postMapper: IPostMapper,
        @inject(TYPES.KafkaProducer) private _kafkaProducer: Producer
    ) {}
    
    async createPost(post:Post): Promise<Post> {
        if (!post.title || !post.content || !post.createdBy) {
            throw new Error("Title, content, and createdBy are required");
        }
        const createdPost = await this._postRepository.create(post);
        await this._kafkaProducer.send({
            topic: "post.created",
            messages: [{ 
                key: createdPost.id.toString(),
                value: JSON.stringify(createdPost)
            }],
        });
        return createdPost;
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