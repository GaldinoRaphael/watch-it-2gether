import type { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";

import type { UserRepository } from "../../ports/repositories/user-repository";
import type { User } from "../database/prisma/generated";

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

    async findById(id: string): Promise<User | null> {
        return this.repositoryClient.client.user.findUnique({ where: { id } });
    }

}