import { UserDTO } from "../../application/dto/UserDTO";
import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { UserMapper } from "../../infrastructure/http/mappers/user-mapper";
import { UserRepository } from "./interfaces/user-repository";

export class UserRepositoryImpl implements UserRepository {
    constructor(readonly repositoryClient: PrismaService) {}
    
    async create(name: string, email: string, passwordHash: string): Promise<UserDTO> {
        const user = await this.repositoryClient.client.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });
        
        return UserMapper.toDTO(user);
    }

}