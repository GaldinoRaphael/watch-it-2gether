import { MovieDTO } from "../../application/dto/MovieDTO";
import { Movie } from "../../domain/entities/Movie";
import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { movieMapper } from "../../infrastructure/http/mappers/movie-mapper";
import { MovieRepository } from "./movie-repository";

export class MovieRepositoryImpl implements MovieRepository {

  constructor(readonly repositoryClient: PrismaService) {}
  
  async getMovieByExternalId(externalId: string): Promise<MovieDTO | null> {
    const movieData = await this.repositoryClient.client.movie.findUnique({
      where: {
        externalId,
      },
    });

    if (!movieData) return null;

    return movieMapper.toDTO(movieData);
  }

  async save(movie: Movie): Promise<MovieDTO> {
    const movieData = await this.repositoryClient.client.movie.create({
      data: {
        id: movie.getId(),
        externalId: movie.externalId,
        title: movie.title,
        year: movie.year,
        posterUrl: movie.posterUrl ?? undefined,
        createdAt: movie.getCreatedAt(),
      },
    });

    console.log("Saved movie to database:", movieData);

    return movieMapper.toDTO(movieData);
  }
}
