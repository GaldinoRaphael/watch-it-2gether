import { Request, Response } from "express";
import {
    CreateMovieInput,
    MovieRepositoryUseCase,
    UpdateMovieInput,
} from "../../../application/useCases/movie-repository-use-case";
import { SearchMoviesUseCase } from "../../../application/useCases/search-movie-use-case";

export class MovieController {
    constructor(
        private readonly searchMoviesUseCase: SearchMoviesUseCase,
        private readonly movieRepositoryUseCase: MovieRepositoryUseCase,
    ) {}

    async search(req: Request, res: Response) {
        try {
            const movies = await this.searchMoviesUseCase.execute(
                String(req.query.query)
            );
            return res.json(movies);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error', errorMessage: (error as Error).message });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            console.log("Getting movie by ID", req.params.id);
            const externalId = String(req.params.id);
            const movie = await this.searchMoviesUseCase.getById(externalId);
            return res.json(movie);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getStoredMovies(req: Request, res: Response) {
        try {
            const movies = await this.movieRepositoryUseCase.getAll();
            return res.json(movies);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getStoredMovieById(req: Request, res: Response) {
        try {
            const movie = await this.movieRepositoryUseCase.getById(String(req.params.id));
            return res.json(movie);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async getStoredMovieByExternalId(req: Request, res: Response) {
        try {
            const movie = await this.movieRepositoryUseCase.getByExternalId(String(req.params.externalId));
            return res.json(movie);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async createStoredMovie(req: Request<{}, {}, CreateMovieInput>, res: Response) {
        try {
            const movie = await this.movieRepositoryUseCase.create(req.body);
            return res.status(201).json(movie);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async updateStoredMovie(req: Request<{ id: string }, {}, UpdateMovieInput>, res: Response) {
        try {
            const movie = await this.movieRepositoryUseCase.update(String(req.params.id), req.body);
            return res.json(movie);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async deleteStoredMovie(req: Request, res: Response) {
        try {
            await this.movieRepositoryUseCase.delete(String(req.params.id));
            return res.status(204).send();
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: unknown) {
        const errorMessage = (error as Error).message;
        const statusCode = errorMessage.toLowerCase().includes("not found") ? 404 : 500;

        return res.status(statusCode).json({
            error: statusCode === 404 ? "Not Found" : "Internal Server Error",
            errorMessage,
        });
    }
}
