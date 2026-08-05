import type { GroupWatchedMovie, Movie } from "../database/prisma/generated";
import type { PrismaService } from "../database/prisma/client/prisma.service";
import type { GroupWatchedMovieRepository } from "../../ports/repositories/group-watched-movie-repository";
import { GroupWatchedMovieId } from "../../domain/value-objects/group-watched-movie-id";

export class GroupWatchedMovieRepositoryImpl implements GroupWatchedMovieRepository {
  constructor(readonly repositoryClient: PrismaService) {}

  async findByID(id: string): Promise<GroupWatchedMovie | null> {
    return this.repositoryClient.client.groupWatchedMovie.findUnique({ where: { id } });
  }

  async getAll(): Promise<GroupWatchedMovie[]> {
    return this.repositoryClient.client.groupWatchedMovie.findMany();
  }

  async save(entity: GroupWatchedMovie): Promise<GroupWatchedMovie> {
    return this.repositoryClient.client.groupWatchedMovie.create({ data: entity });
  }

  async update(id: string, entity: GroupWatchedMovie): Promise<GroupWatchedMovie> {
    return this.repositoryClient.client.groupWatchedMovie.update({ where: { id }, data: entity });
  }

  async delete(id: string): Promise<void> {
    await this.repositoryClient.client.groupWatchedMovie.delete({ where: { id } });
  }

  async upsert(groupId: string, movieId: string): Promise<GroupWatchedMovie> {
    const id = GroupWatchedMovieId.generate().getValue();
    return this.repositoryClient.client.groupWatchedMovie.upsert({
      where: { groupId_movieId: { groupId, movieId } },
      create: { id, group: { connect: { id: groupId } }, movie: { connect: { id: movieId } } },
      // unique constraint enforces idempotency — no fields need updating
      update: {},
    });
  }

  async getByGroupIdWithMovie(groupId: string): Promise<(GroupWatchedMovie & { movie: Movie })[]> {
    return this.repositoryClient.client.groupWatchedMovie.findMany({
      where: { groupId },
      include: { movie: true },
      orderBy: { includedAt: "desc" },
    });
  }
}
