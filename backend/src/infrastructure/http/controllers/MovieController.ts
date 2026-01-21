import { Request, Response } from "express";
import { SearchMoviesUseCase } from "../../../application/useCases/SearchMoviesUseCase";

export class MovieController {
    constructor(private searchMoviesUseCase: SearchMoviesUseCase) {}

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
            res.status(500).json({ error: 'Internal Server Error', errorMessage: (error as Error).message });
        }
    }
}
