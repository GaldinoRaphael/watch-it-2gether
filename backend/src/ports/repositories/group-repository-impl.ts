import { GroupDTO } from "../../application/dto/GroupDTO";
import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { groupMapper } from "../../infrastructure/http/mappers/group-mapper";
import { GroupRepository } from "./interfaces/group-repository";

export class GroupRepositoryImpl implements GroupRepository {
    constructor(readonly repositoryClient: PrismaService) {}

    async getByID(id: string): Promise<GroupDTO | null> {
        const group = await this.repositoryClient.client.group.findUnique({
            where: { id },
        });

        return group ? groupMapper.toDTO(group) : null;
    }

    async getAll(): Promise<GroupDTO[]> {
        const groups = await this.repositoryClient.client.group.findMany();
        return groups.map(groupMapper.toDTO);
    }

    async save(entity: GroupDTO): Promise<GroupDTO> {
        const group = await this.repositoryClient.client.group.create({
            data: {
                id: entity.id,
                name: entity.name,
                owner: { connect: { id: entity.ownerId } },
                createdAt: entity.createdAt ?? new Date().toISOString(),
            },
        });

        return groupMapper.toDTO(group);
    }

    async update(id: string, entity: GroupDTO): Promise<GroupDTO> {
        const group = await this.repositoryClient.client.group.update({
            where: { id },
            data: {
                name: entity.name,
                owner: { connect: { id: entity.ownerId } },
                createdAt: entity.createdAt ?? new Date().toISOString(),
            },
        });

        return groupMapper.toDTO(group);
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