import type { Request, Response } from "express";
import { AcceptGroupInviteUseCase } from "../../../application/useCases/group-invite/accept-group-invite-use-case";
import { CreateGroupInviteUseCase } from "../../../application/useCases/group-invite/create-group-invite-use-case";
import { GetGroupInviteUseCase } from "../../../application/useCases/group-invite/get-group-invite-use-case";

export class GroupInviteController {
  constructor(
    private readonly createGroupInviteUseCase: CreateGroupInviteUseCase,
    private readonly acceptGroupInviteUseCase: AcceptGroupInviteUseCase,
    private readonly getGroupInviteUseCase: GetGroupInviteUseCase,
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

  async getGroupInvite(req: Request, res: Response) {
    try {
      const token = String(req.params.token);
      const invite = await this.getGroupInviteUseCase.execute(token);
      return res.status(200).json(invite);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    const errorMessage = (error as Error).message;
    const normalizedMessage = errorMessage.toLowerCase();

    let statusCode = 500;
    if (normalizedMessage.includes("not found")) {
      statusCode = 404;
    } else if (normalizedMessage.includes("only owner")) {
      statusCode = 403;
    } else if (normalizedMessage.includes("already a member")) {
      statusCode = 409;
    }

    const errorTypeByStatus: Record<number, string> = {
      403: "Forbidden",
      404: "Not Found",
      409: "Conflict",
      500: "Internal Server Error",
    };

    return res.status(statusCode).json({
      error: errorTypeByStatus[statusCode] ?? "Internal Server Error",
      errorMessage,
    });
  }
}
