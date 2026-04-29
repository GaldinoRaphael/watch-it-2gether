import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { UserMapper } from "../../infrastructure/http/mappers/user-mapper";
import { UserRepository } from "../../ports/repositories/user-repository";
import { User } from "../database/prisma/generated";

export class UserRepositoryImpl implements UserRepository {

    constructor(readonly repositoryClient: PrismaService) {}

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.repositoryClient.client.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return null;
        }

        return user;
    }
    
    async create(name: string, email: string, passwordHash: string): Promise<User> {
        const user = await this.repositoryClient.client.user.create({
            data: {
                name,
                email,
                passwordHash,
            },
        });
        
        return user;
    }

}