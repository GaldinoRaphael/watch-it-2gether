import { MovieDTO } from "../dto/MovieDTO";
import { MovieId } from "../../domain/value-objects/movie-id";
import type { MovieRepository } from "../../ports/repositories/movie-repository";
import { movieMapper } from "../../infrastructure/http/mappers/movie-mapper";

export interface CreateMovieInput {
  id?: string;
  externalId: string;
  title: string;
  year: string;
  posterUrl?: string;
  createdAt?: string;
}

export interface UpdateMovieInput {
  externalId?: string;
  title?: string;
  year?: string;
  posterUrl?: string;
  createdAt?: string;
}

export class MovieRepositoryUseCase {
  constructor(private readonly movieRepository: MovieRepository) {}

  async getById(id: string): Promise<MovieDTO> {
    const movie = await this.movieRepository.findByID(id);

    if (!movie) {
      throw new Error("Movie not found");
    }

    return movieMapper.toDTO(movie);
  }

  async getAll(): Promise<MovieDTO[]> {
    const movies = await this.movieRepository.getAll();
    return movies.map((m) => movieMapper.toDTO(m));
  }

  async getByExternalId(externalId: string): Promise<MovieDTO> {
    const movie = await this.movieRepository.getMovieByExternalId(externalId);

    if (!movie) {
      throw new Error("Movie not found");
    }

    return movieMapper.toDTO(movie);
  }

  async create(input: CreateMovieInput): Promise<MovieDTO> {
    const dto = new MovieDTO(
      input.id ?? MovieId.generate().getValue(),
      input.externalId,
      input.title,
      input.year,
      input.posterUrl,
      input.createdAt ?? new Date().toISOString(),
    );

    const saved = await this.movieRepository.save(movieMapper.toDomain(dto));
    return movieMapper.toDTO(saved);
  }

  async update(id: string, input: UpdateMovieInput): Promise<MovieDTO> {
    const currentMovie = await this.getById(id);

    const dto = new MovieDTO(
      id,
      input.externalId ?? currentMovie.externalId,
      input.title ?? currentMovie.title,
      input.year ?? currentMovie.year,
      input.posterUrl ?? currentMovie.posterUrl,
      input.createdAt ?? currentMovie.createdAt,
    );

    const updated = await this.movieRepository.update(id, movieMapper.toDomain(dto));
    return movieMapper.toDTO(updated);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.movieRepository.delete(id);
  }
}
