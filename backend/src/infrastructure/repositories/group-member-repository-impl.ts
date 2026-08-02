import { randomUUID } from "node:crypto";
import type { PrismaService } from "../database/prisma/client/prisma.service";
import type { GroupMemberRepository } from "../../ports/repositories/group-member-repository";
import type { GroupMember } from "../database/prisma/generated";

export class GroupMemberRepositoryImpl implements GroupMemberRepository {
  constructor(private readonly repositoryClient: PrismaService) {}

  async findByGroupId(groupId: string): Promise<GroupMember[]> {
    return this.repositoryClient.client.groupMember.findMany({
      where: { groupId },
    });
  }

  async findByGroupAndUser(groupId: string, userId: string): Promise<GroupMember | null> {
    return this.repositoryClient.client.groupMember.findUnique({
      where: { groupId_userId: { groupId, userId } },
    });
  }

  async create(groupId: string, userId: string): Promise<GroupMember> {
    return this.repositoryClient.client.groupMember.create({
      data: {
        id: randomUUID(),
        groupId,
        userId,
        joinedAt: new Date(),
      },
    });
  }

  async delete(groupId: string, userId: string): Promise<void> {
    await this.repositoryClient.client.groupMember.delete({
      where: { groupId_userId: { groupId, userId } },
    });
  }
}
