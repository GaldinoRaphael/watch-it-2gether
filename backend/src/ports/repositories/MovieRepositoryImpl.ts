import { MovieDTO } from "../../application/dto/MovieDTO";
import { Movie } from "../../domain/entities/Movie";
import { movieMapper } from "../../infrastructure/http/mappers/movieMapper";
import { MovieRepository } from "./MovieRepository";
import prisma from '../../infrastructure/database/prisma/client/prisma.service';

export class MovieRepositoryImpl implements MovieRepository {
  async getMovieByExternalId(externalId: string): Promise<MovieDTO | null> {
    const movieData = await prisma.movie.findUnique({
      where: {
        externalId,
      },
    });

    if (!movieData) return null;

    return movieMapper.toDTO(movieData);
  }

  async save(movie: Movie): Promise<MovieDTO> {
    const movieData = await prisma.movie.create({
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
