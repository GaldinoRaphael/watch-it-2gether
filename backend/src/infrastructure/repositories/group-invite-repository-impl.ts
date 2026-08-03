import { randomUUID } from "node:crypto";
import { GroupInviteRepository } from "../../ports/repositories/group-invite-repository";
import { PrismaService } from "../database/prisma/client/prisma.service";
import { GroupInvite } from "../database/prisma/generated";

export class GroupInviteRepositoryImpl implements GroupInviteRepository {
  constructor(private readonly repositoryClient: PrismaService) {}

  findByGroupId(groupId: string): Promise<GroupInvite | null> {
    return this.repositoryClient.client.groupInvite.findFirst({
      where: {
        groupId,
      },
    });
  }

  async create(groupId: string, invitedById: string) {
    return this.repositoryClient.client.groupInvite.create({
      data: {
        groupId,
        invitedById,
        token: randomUUID(),
      },
    });
  }

  async findByToken(token: string) {
    return this.repositoryClient.client.groupInvite.findUnique({
      where: {
        token,
      },
    });
  }

  async deleteByGroupId(
    groupId: string
  ): Promise<void> {
    await this.repositoryClient.client.groupInvite.deleteMany({
      where: {
        groupId,
      },
    });

  }
}
