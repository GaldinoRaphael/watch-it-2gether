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
            {
                id: user.getId(),
                name: user.name,
                email: user.email,
                createdAt: user.createdAt
            },
            ""
        );
    }

    static dtoToResponseDTO(userDTO: UserDTO): UserResponseDTO {
        return new UserResponseDTO(
            {
                id: userDTO.id,
                name: userDTO.name,
                email: userDTO.email,
                createdAt: userDTO.createdAt
            },
            ""
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