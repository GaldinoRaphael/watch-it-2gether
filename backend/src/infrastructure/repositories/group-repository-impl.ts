import type { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import type { GroupRepository } from "../../ports/repositories/group-repository";
import type { Group } from "../database/prisma/generated";

export class GroupRepositoryImpl implements GroupRepository {
  constructor(readonly repositoryClient: PrismaService) {}

  async findByID(id: string): Promise<Group | null> {
    const group = await this.repositoryClient.client.group.findUnique({
      where: { id },
    });

    return group ? group : null;
  }

  async getAll(): Promise<Group[]> {
    const groups = await this.repositoryClient.client.group.findMany();
    return groups;
  }

  async findAllByUserId(userId: string): Promise<Group[]> {
    const members = await this.repositoryClient.client.groupMember.findMany({
      where: { userId },
      include: { group: true },
    });
    return members.map((m) => m.group);
  }

  async save(entity: Group): Promise<Group> {
    const group = await this.repositoryClient.client.group.create({
      data: {
        id: entity.id,
        name: entity.name,
        owner: { connect: { id: entity.ownerId } },
        createdAt: entity.createdAt ?? new Date(),
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
        createdAt: entity.createdAt ?? new Date(),
      },
    });

    return group;
  }

  async delete(id: string): Promise<void> {
    await this.repositoryClient.client.$transaction([
      this.repositoryClient.client.groupMember.deleteMany({ where: { groupId: id } }),
      this.repositoryClient.client.vote.deleteMany({ where: { groupId: id } }),
      this.repositoryClient.client.group.delete({ where: { id } }),
    ]);
  }
}
