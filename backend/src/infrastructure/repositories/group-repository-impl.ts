import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { GroupRepository } from "../../ports/repositories/group-repository";
import { Group } from "../database/prisma/generated";

export class GroupRepositoryImpl implements GroupRepository {
    constructor(readonly repositoryClient: PrismaService) {}

    async getByID(id: string): Promise<Group | null> {
        const group = await this.repositoryClient.client.group.findUnique({
            where: { id },
        });

        return group ? group : null;
    }

    async getAll(): Promise<Group[]> {
        const groups = await this.repositoryClient.client.group.findMany();
        return groups;
    }

    async save(entity: Group): Promise<Group> {
        const group = await this.repositoryClient.client.group.create({
            data: {
                id: entity.id,
                name: entity.name,
                owner: { connect: { id: entity.ownerId } },
                createdAt: entity.createdAt ?? new Date().toISOString(),
            },
        });

        return group;
    }

    async update(id: string, entity: Group): Promise<Group> {
        const group = await this.repositoryClient.client.group.update({
            where: { id },
            data: {
                name: entity.name,
                owner: { connect: { id: entity.ownerId } },
                createdAt: entity.createdAt ?? new Date().toISOString(),
            },
        });

        return group;
    }

    async delete(id: string): Promise<void> {
        await this.repositoryClient.client.$transaction([
            this.repositoryClient.client.groupMember.deleteMany({ where: { groupId: id } }),
            this.repositoryClient.client.commentary.deleteMany({ where: { vote: { groupId: id } } }),
            this.repositoryClient.client.vote.deleteMany({ where: { groupId: id } }),
            this.repositoryClient.client.group.delete({ where: { id } }),
        ]);
    }
}