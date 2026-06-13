import { controller, httpGet, httpPost } from "inversify-express-utils";
import { IPostService } from "../services";
import { TYPES } from "../lib/types";
import { inject } from "inversify";
import { Post } from "../entities";
import { Request, Response } from "express";
import { IPostMapper } from "../mapper/Post.mapper";


export interface IPostController {
    addPost(req: Request, res: Response): Promise<Response>;
    getPosts(req: Request, res: Response): Promise<Response>;
    getPostById(req: Request, res: Response): Promise<Response>;
}

@controller("/posts")
export class PostController implements IPostController {
    constructor(
        @inject(TYPES.PostService) private _postService: IPostService,
        @inject(TYPES.PostMapper) private _postMapper: IPostMapper
    ) {}

    @httpPost("/")
    public async addPost(req: Request, res: Response): Promise<Response> {
        try {
            const { title, content, createdBy } = req.body;
            if (!title || !content || !createdBy) {
                return res.status(400).json({ error: "Title, content, and createdBy are required" });
            }
            const post = new Post();
            post.title = title;
            post.content = content;
            post.createdBy = createdBy;

            const createdPost = await this._postService.createPost(post);
            return res.status(201).json( this._postMapper.toPostDTO(createdPost) );
        } catch (error) {
            console.error("Error creating post:", error);
            return res.status(500).json({ error: "Failed to create post" });
        }
    }
    @httpGet("/")
    public async getPosts(req: Request, res: Response): Promise<Response> {
        try {
            const posts = await this._postService.getAllPosts();
            return res.status(200).json(posts.map(post => this._postMapper.toPostDTO(post)));
        } catch (error) {
            console.error("Error fetching posts:", error);
            return res.status(500).json({ error: "Failed to fetch posts" });
        }
    }

    @httpGet("/:id")
    public async getPostById(req: Request, res: Response): Promise<Response> {
        const id = +req.params.id;
        if (isNaN(Number(id))) {
            return res.status(400).json({ error: "Invalid post ID" });
        }
        try {
            const post = await this._postService.getPostById(id);
            return res.status(200).json(this._postMapper.toPostDTO(post));
        } catch (error) {
            console.error(`Error fetching post with ID ${id}:`, error);
            return res.status(500).json({ error: "Failed to fetch post" });
        }
    }

}