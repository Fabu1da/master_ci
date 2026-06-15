import { Container } from "inversify";
import { PostService, UserService } from "./src/services";
import { TYPES } from "./src/lib/types";
import { PostRepository } from "./src/repositories";
import { PostMapper } from "./src/mapper";
import { IPostRepository } from "./src/repositories/Post.repository";
import { IPostMapper } from "./src/mapper/Post.mapper";

import "./src/controllers";
import { IUserRepository, UserRepository } from "./src/repositories/User.repository";
import { IUserMapper, UserMapper } from "./src/mapper/User.mapper";
import { IPostService } from "./src/services/Post.service";
import { IUserService } from "./src/services/User.service";

export const diContainer: Container = new Container();
diContainer.bind<IPostService>(TYPES.PostService).to(PostService);
diContainer.bind<IPostRepository>(TYPES.PostRepository).to(PostRepository);
diContainer.bind<IPostMapper>(TYPES.PostMapper).to(PostMapper);
diContainer.bind<IUserMapper>(TYPES.UserMapper).to(UserMapper);
diContainer.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
diContainer.bind<IUserService>(TYPES.UserService).to(UserService);
