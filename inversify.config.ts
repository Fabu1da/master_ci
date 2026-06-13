import { Container } from "inversify";
import { IPostService, PostService } from "./src/services";
import { TYPES } from "./src/lib/types";
import { PostRepository } from "./src/repositories";
import { PostMapper } from "./src/mapper";
import { IPostRepository } from "./src/repositories/Post.repository";
import { IPostMapper } from "./src/mapper/Post.mapper";

import "./src/controllers";

export const diContainer: Container = new Container();
diContainer.bind<IPostService>(TYPES.PostService).to(PostService);
diContainer.bind<IPostRepository>(TYPES.PostRepository).to(PostRepository);
diContainer.bind<IPostMapper>(TYPES.PostMapper).to(PostMapper);
