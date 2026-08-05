import type { GroupWatchedMovieUseCase } from "../../../application/useCases/group-watched-movie-use-case";
import type { Request, Response } from "express";

export class GroupWatchedMovieController {
  constructor(private readonly groupWatchedMovieUseCase: GroupWatchedMovieUseCase) {}

  async getWatchedMoviesByGroup(req: Request, res: Response) {
    try {
      const movies = await this.groupWatchedMovieUseCase.getByGroupId(String(req.params.groupId));
      return res.json(movies);
    } catch (error) {
      const errorMessage = (error as Error).message;
      const statusCode = errorMessage.toLowerCase().includes("not found") ? 404 : 500;
      return res.status(statusCode).json({
        error: statusCode === 404 ? "Not Found" : "Internal Server Error",
        errorMessage,
      });
    }
  }
}
