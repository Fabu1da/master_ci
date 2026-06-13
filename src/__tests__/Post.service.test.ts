import "reflect-metadata";
import { PostMapper } from "../mapper";
import { IPostRepository } from "../repositories/Post.repository";
import { PostService } from "../services/Post.service";
import { Post } from "../entities";

describe("PostService Tests", () => {

    let postService: PostService;
    let mockPostRepository :jest.Mocked<IPostRepository>;
    let mockPostMapper: jest.Mocked<PostMapper>;

    beforeEach(() => {
        mockPostRepository = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn()
        };

        mockPostMapper = {
            toPostDTO: jest.fn()
        } as any;

        postService = new PostService(mockPostRepository, mockPostMapper);
    });

   
    it("should create a post", async () => {
        const post = new Post();
        post.title = "Test Post";
        post.content = "This is a test post.";
        post.createdAt = new Date();
        post.createdBy = 1;

        mockPostRepository.create.mockResolvedValue(post);

        const result = await postService.createPost(post);
        expect(mockPostRepository.create).toHaveBeenCalledWith(post);
        expect(result).toBe(post);
       
    })

    it("should get all posts", async () => {
        const post1 = new Post();
        post1.title = "Test Post 1";
        post1.content = "This is the first test post.";
        post1.createdAt = new Date();
        post1.createdBy = 1;

        const post2 = new Post();
        post2.title = "Test Post 2";
        post2.content = "This is the second test post.";
        post2.createdAt = new Date();
        post2.createdBy = 2;

        mockPostRepository.findAll.mockResolvedValue([post1, post2]);

        const result = await postService.getAllPosts();
        expect(mockPostRepository.findAll).toHaveBeenCalled();
        expect(result).toEqual([post1, post2]);
    });

    it("should get a post by ID", async () => {
        const post = new Post();
        post.id = 7;

        mockPostRepository.findById.mockResolvedValue(post);

        const result = await postService.getPostById(7);
        expect(mockPostRepository.findById).toHaveBeenCalledWith(7);
        expect(result).toBe(post);
    });

    it("should throw an error if post not found", async () => {
        // arrange
        mockPostRepository.findById.mockResolvedValue(null);

        // act & expect
        await expect(postService.getPostById(999)).rejects.toThrow("Post not found");
    });
   

});