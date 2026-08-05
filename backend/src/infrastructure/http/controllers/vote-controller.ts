import type { VoteUseCase } from "../../../application/useCases/vote-use-case";
import type {
  CreateVoteInput,
  UpdateVoteInput,
  VoteRepositoryUseCase,
} from "../../../application/useCases/vote-repository-use-case";
import type { Request, Response } from "express";

export class VoteController {
  constructor(
    private readonly voteUseCase: VoteUseCase,
    private readonly voteRepositoryUseCase: VoteRepositoryUseCase,
  ) {}

  async voteMovie(
    req: Request<
      { id?: string },
      object,
      {
        userId: string;
        groupId: string;
        externalId: string;
        movieTitle?: string;
        posterUrl?: string;
        rating: number;
        commentary: string;
        voteId?: string;
      }
    >,
    res: Response,
  ) {
    try {
      const { userId, groupId, externalId, movieTitle, posterUrl, rating, commentary, voteId } =
        req.body;
      const result = await this.voteUseCase.execute({
        userId,
        groupId,
        externalId: String(externalId),
        movieTitle,
        posterUrl,
        rating,
        commentary,
        voteId: req.params.id ?? voteId,
      });
      return res.json(result);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getVotes(req: Request, res: Response) {
    try {
      const votes = await this.voteRepositoryUseCase.getAll();
      return res.json(votes);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getVoteById(req: Request, res: Response) {
    try {
      const vote = await this.voteRepositoryUseCase.getById(String(req.params.id));
      return res.json(vote);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async createVote(req: Request<object, object, CreateVoteInput>, res: Response) {
    try {
      const vote = await this.voteRepositoryUseCase.create(req.body);
      return res.status(201).json(vote);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async updateVote(req: Request, res: Response) {
    try {
      const vote = await this.voteRepositoryUseCase.update(
        String(req.params.id),
        req.body as UpdateVoteInput,
      );
      return res.json(vote);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async deleteVote(req: Request, res: Response) {
    try {
      await this.voteRepositoryUseCase.delete(String(req.params.id));
      return res.status(204).send();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getVotesByGroup(req: Request, res: Response) {
    try {
      const votes = await this.voteRepositoryUseCase.getByGroupId(String(req.params.groupId));
      return res.json(votes);
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
