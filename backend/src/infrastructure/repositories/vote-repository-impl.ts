import type { VoteEntity } from "../../domain/entities/vote-entity";
import type { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";

import type { VoteRepository } from "../../ports/repositories/vote-repository";
import type { Vote } from "../database/prisma/generated";

export class VoteRepositoryImpl implements VoteRepository {
  constructor(readonly repositoryClient: PrismaService) {}

  async findByID(id: string): Promise<Vote | null> {
    return this.repositoryClient.client.vote.findUnique({ where: { id } });
  }

  async getAll(): Promise<Vote[]> {
    return this.repositoryClient.client.vote.findMany();
  }

  async save(entity: Vote): Promise<Vote> {
    return this.repositoryClient.client.vote.create({ data: entity });
  }

  async update(id: string, entity: Vote): Promise<Vote> {
    return this.repositoryClient.client.vote.update({ where: { id }, data: entity });
  }

  async delete(id: string): Promise<void> {
    await this.repositoryClient.client.vote.delete({ where: { id } });
  }

  async saveComplete(newVote: VoteEntity, commentary: string): Promise<Vote> {
    return this.repositoryClient.client.vote.create({
      data: {
        id: newVote.getId(),
        group: { connect: { id: newVote.getGroupId() } },
        user: { connect: { id: newVote.getUserId() } },
        movie: { connect: { id: newVote.getMovieId() } },
        rating: newVote.rating,
        commentary,
        createdAt: newVote.createdAt,
      },
    });
  }

  async updateComplete(voteId: string, rating: number, commentary: string): Promise<Vote> {
    return this.repositoryClient.client.vote.update({
      where: { id: voteId },
      data: { rating, commentary },
    });
  }

  async getByGroupId(groupId: string): Promise<Vote[]> {
    return this.repositoryClient.client.vote.findMany({
      where: { groupId },
      orderBy: { rating: "desc" },
    });
  }
}
