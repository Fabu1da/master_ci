import { injectable } from "inversify";
import { Post } from "../entities";
import { PostDTO } from "../dtos/Post.Dto";

export interface IPostMapper {
    toPostDTO(post: Post): PostDTO;
}

@injectable()
export class PostMapper implements IPostMapper {
    toPostDTO(post: Post): PostDTO{
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            createdAt: post.createdAt,
            createdBy: post.createdBy
        };
    }

}