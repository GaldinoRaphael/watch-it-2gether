import { UserDTO } from "../../../application/dto/UserDTO";   
import { UserResponseDTO } from "../../../application/dto/response/UserResponseDTO";
import { UserEntity } from "../../../domain/entities/user-entity";
import { User } from "../../database/prisma/generated";


export class UserMapper {
    static entityToDTO(user: UserEntity): UserDTO {
        return new UserDTO(
            user.getId(),
            user.name,
            user.email,
            user.passwordHash ?? ""
        );
    }

    static toResponseDTO(user: UserEntity): UserResponseDTO {
        return new UserResponseDTO(
            user.getId(),
            user.name,
            user.email,
            user.createdAt
        );
    }

    static dtoToResponseDTO(userDTO: UserDTO): UserResponseDTO {
        return new UserResponseDTO(
            userDTO.id,
            userDTO.name,
            userDTO.email,
            userDTO.createdAt
        );
    }

    static toDTO(user: User): UserDTO {
        return new UserDTO(
            user.id,
            user.name,
            user.email,
            user.passwordHash,
            user.createdAt.toISOString()
        );
    }

}