import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { MovieRepository } from "../../ports/repositories/movie-repository";
import { Movie } from "../database/prisma/generated";


export class MovieRepositoryImpl implements MovieRepository {

  constructor(readonly repositoryClient: PrismaService) {}

  async getByID(id: string): Promise<Movie | null> {
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
      where: {
        id,
      },
      data: {
        externalId: entity.externalId,
        title: entity.title,
        year: entity.year,
        posterUrl: entity.posterUrl ?? undefined,
        createdAt: entity.createdAt ?? new Date().toISOString(),
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
      where: {
        externalId,
      },
    });

    if (!movieData){ 
      return null
    };

    return movieData;
  }

  async save(Movie: Movie): Promise<Movie> {
    const movieData = await this.repositoryClient.client.movie.create({
      data: {
        id: Movie.id,
        externalId: Movie.externalId,
        title: Movie.title,
        year: Movie.year,
        posterUrl: Movie.posterUrl ?? undefined,
        createdAt: Movie.createdAt ?? new Date().toISOString(),
      },
    });


    return movieData;
  }
}
