import type { Request, Response } from "express";
import { CreateGroupInviteUseCase } from "../../../application/useCases/create-group-invite-use-case";
import { AcceptGroupInviteUseCase } from "../../../application/useCases/accept-group-invite-use-case";

export class GroupInviteController {
  constructor(
    private readonly createGroupInviteUseCase: CreateGroupInviteUseCase,
    private readonly acceptGroupInviteUseCase: AcceptGroupInviteUseCase
  ) {}

  async createGroupInvite(req: Request, res: Response) {
    try {
      const groupId = String(req.params.groupId);
      const userId = req.user!.id;
      const invite = await this.createGroupInviteUseCase.execute(groupId, userId);
      return res.status(201).json(invite);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async acceptGroupInvite(req: Request, res: Response) {
    try {
      const token = String(req.params.token);
      const userId = req.user!.id;
      const result = await this.acceptGroupInviteUseCase.execute(token, userId);
      return res.status(200).json(result);
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
