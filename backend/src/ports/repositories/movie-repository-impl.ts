import { MovieDTO } from "../../application/dto/MovieDTO";
import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { movieMapper } from "../../infrastructure/http/mappers/movie-mapper";
import { MovieRepository } from "./interfaces/movie-repository";


export class MovieRepositoryImpl implements MovieRepository {

  constructor(readonly repositoryClient: PrismaService) {}

  async getByID(id: string): Promise<MovieDTO> {
    const movie = await this.repositoryClient.client.movie.findUnique({
      where: {
        id,
      },
    });

    return movie ? movieMapper.toDTO(movie) : Promise.reject(new Error("Movie not found"));
  }

  async getAll(): Promise<MovieDTO[]> {
    const movies = await this.repositoryClient.client.movie.findMany();
    return movies.map(movieMapper.toDTO);
  }

  async update(id: string, entity: MovieDTO): Promise<MovieDTO> {
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

    return movieMapper.toDTO(movie);
  }

  async delete(id: string): Promise<void> {
    await this.repositoryClient.client.movie.delete({
      where: {
        id,
      },
    });
  }
  
  async getMovieByExternalId(externalId: string): Promise<MovieDTO | null> {
    const movieData = await this.repositoryClient.client.movie.findUnique({
      where: {
        externalId,
      },
    });

    if (!movieData) return null;

    return movieMapper.toDTO(movieData);
  }

  async save(movieDTO: MovieDTO): Promise<MovieDTO> {
    const movieData = await this.repositoryClient.client.movie.create({
      data: {
        id: movieDTO.id,
        externalId: movieDTO.externalId,
        title: movieDTO.title,
        year: movieDTO.year,
        posterUrl: movieDTO.posterUrl ?? undefined,
        createdAt: movieDTO.createdAt ?? new Date().toISOString(),
      },
    });

    console.log("Saved movie to database:", movieData);

    return movieMapper.toDTO(movieData);
  }
}
