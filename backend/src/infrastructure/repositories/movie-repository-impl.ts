import type { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import type { MovieRepository } from "../../ports/repositories/movie-repository";
import type { Movie } from "../database/prisma/generated";

export class MovieRepositoryImpl implements MovieRepository {
  constructor(readonly repositoryClient: PrismaService) {}

  async findByID(id: string): Promise<Movie | null> {
    const movie = await this.repositoryClient.client.movie.findUnique({
      where: {
        id,
      },
    });

    if (!movie) {
      return null;
    }

    return movie;
  }

  async getAll(): Promise<Movie[]> {
    const movies = await this.repositoryClient.client.movie.findMany();
    return movies;
  }

  async update(id: string, entity: Movie): Promise<Movie> {
    const movie = await this.repositoryClient.client.movie.update({
      where: { id },
      data: {
        externalId: entity.externalId,
        title: entity.title,
        year: entity.year,
        posterUrl: entity.posterUrl ?? undefined,
        createdAt: entity.createdAt ?? new Date(),
      },
    });

    return movie;
  }

  async delete(id: string): Promise<void> {
    await this.repositoryClient.client.movie.delete({
      where: {
        id,
      },
    });
  }

  async getMovieByExternalId(externalId: string): Promise<Movie | null> {
    const movieData = await this.repositoryClient.client.movie.findUnique({
      where: { externalId },
    });

    return movieData ?? null;
  }

  async save(movie: Movie): Promise<Movie> {
    const movieData = await this.repositoryClient.client.movie.create({
      data: {
        id: movie.id,
        externalId: movie.externalId,
        title: movie.title,
        year: movie.year,
        posterUrl: movie.posterUrl ?? undefined,
        createdAt: movie.createdAt ?? new Date(),
      },
    });

    return movieData;
  }
}
