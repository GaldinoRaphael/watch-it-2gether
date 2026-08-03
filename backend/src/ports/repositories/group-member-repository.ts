import { randomUUID } from "node:crypto";
import type { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import type { GroupMember } from "../../infrastructure/database/prisma/generated";
import type { GroupMemberRepository } from "../../infrastructure/repositories/group-member-repository";

export class GroupMemberRepositoryImpl implements GroupMemberRepository {
  constructor(
    private readonly repositoryClient: PrismaService
  ) {}

  async findByGroupId(groupId: string): Promise<GroupMember[]> {
    return this.repositoryClient.client.groupMember.findMany({
      where: {
        groupId,
      },
    });
  }

  async findByGroupAndUser(
    groupId: string,
    userId: string
  ): Promise<GroupMember | null> {
    return this.repositoryClient.client.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  }

  async addMemberToGroup(
    groupId: string,
    userId: string
  ): Promise<GroupMember> {
    return this.repositoryClient.client.groupMember.create({
      data: {
        id: randomUUID(),
        groupId,
        userId,
      },
    });
  }

  async delete(
    groupId: string,
    userId: string
  ): Promise<void> {
    await this.repositoryClient.client.groupMember.delete({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  }
}