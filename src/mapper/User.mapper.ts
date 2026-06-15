import { UserDTO } from "../dtos/user.Dto";
import { injectable } from "inversify";
import { User } from "../entities/user.entity";

export interface IUserMapper {
    toEntity(userDto: UserDTO): User;
    toDto(user: User): Omit<UserDTO, "password">;
}


@injectable()
export class UserMapper implements IUserMapper {
    toEntity(userDto: UserDTO): User {
        const user = new User();
        user.id = userDto.id;
        user.email = userDto.email;
        user.firstName = userDto.firstName;
        user.lastName = userDto.lastName;
        user.password = userDto.password;
        return user;
    }

    toDto(user: User): Omit<UserDTO, "password"> {
        const userDto = new UserDTO();
        userDto.id = user.id;
        userDto.email = user.email;
        userDto.firstName = user.firstName;
        userDto.lastName = user.lastName;
        return userDto;
    }
}