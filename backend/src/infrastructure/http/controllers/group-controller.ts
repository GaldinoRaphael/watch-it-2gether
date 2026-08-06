import type { Request, Response } from "express";
import type {
  CreateGroupInput,
  GroupRepositoryUseCase,
  UpdateGroupInput,
} from "../../../application/useCases/group-repository-use-case";

export class GroupController {
  constructor(private readonly groupRepositoryUseCase: GroupRepositoryUseCase) {}

  async getGroups(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const groups = await this.groupRepositoryUseCase.getAllByUserId(userId);
      return res.json(groups);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async getGroupById(req: Request, res: Response) {
    try {
      const group = await this.groupRepositoryUseCase.getById(String(req.params.id));
      return res.json(group);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async createGroup(req: Request<object, object, CreateGroupInput>, res: Response) {
    try {
      const ownerId = req.user!.id;
      const group = await this.groupRepositoryUseCase.create({ ...req.body, ownerId });
      return res.status(201).json(group);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async updateGroup(req: Request, res: Response) {
    try {
      const group = await this.groupRepositoryUseCase.update(
        String(req.params.id),
        req.body as UpdateGroupInput,
        req.user!.id,
      );
      return res.json(group);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async deleteGroup(req: Request, res: Response) {
    try {
      await this.groupRepositoryUseCase.delete(String(req.params.id), req.user!.id);
      return res.status(204).send();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    const errorMessage = (error as Error).message;
    const lower = errorMessage.toLowerCase();
    const statusCode = lower.includes("not found") ? 404 : lower.includes("forbidden") ? 403 : 500;
    const publicMessage =
      statusCode === 500 && process.env.NODE_ENV === "production" ? "Internal Server Error" : errorMessage;

    return res.status(statusCode).json({
      error: statusCode === 404 ? "Not Found" : statusCode === 403 ? "Forbidden" : "Internal Server Error",
      errorMessage: publicMessage,
    });
  }
}
