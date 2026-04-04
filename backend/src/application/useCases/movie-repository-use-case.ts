import { MovieDTO } from "../dto/MovieDTO";
import { MovieId } from "../../domain/value-objects/movie-id";
import { MovieRepository } from "../../ports/repositories/interfaces/movie-repository";

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
        const movie = await this.movieRepository.getByID(id);

        if (!movie) {
            throw new Error("Movie not found");
        }

        return movie;
    }

    async getAll(): Promise<MovieDTO[]> {
        return this.movieRepository.getAll();
    }

    async getByExternalId(externalId: string): Promise<MovieDTO> {
        const movie = await this.movieRepository.getMovieByExternalId(externalId);

        if (!movie) {
            throw new Error("Movie not found");
        }

        return movie;
    }

    async create(input: CreateMovieInput): Promise<MovieDTO> {
        const movie = new MovieDTO(
            input.id ?? MovieId.generate().getValue(),
            input.externalId,
            input.title,
            input.year,
            input.posterUrl,
            input.createdAt ?? new Date().toISOString(),
        );

        return this.movieRepository.save(movie);
    }

    async update(id: string, input: UpdateMovieInput): Promise<MovieDTO> {
        const currentMovie = await this.getById(id);

        const movie = new MovieDTO(
            id,
            input.externalId ?? currentMovie.externalId,
            input.title ?? currentMovie.title,
            input.year ?? currentMovie.year,
            input.posterUrl ?? currentMovie.posterUrl,
            input.createdAt ?? currentMovie.createdAt,
        );

        return this.movieRepository.update(id, movie);
    }

    async delete(id: string): Promise<void> {
        await this.getById(id);
        await this.movieRepository.delete(id);
    }
}