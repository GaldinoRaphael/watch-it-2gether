import type { Request, Response } from "express";
import type { GroupMemberUseCase } from "../../../application/useCases/group-member-use-case";

export class GroupMemberController {
  constructor(private readonly groupMemberUseCase: GroupMemberUseCase) {}

  async getMembers(req: Request, res: Response) {
    try {
      const members = await this.groupMemberUseCase.getMembers(String(req.params.groupId));
      return res.json(members);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async leaveGroup(req: Request, res: Response) {
    try {
      const groupId = String(req.params.groupId);
      await this.groupMemberUseCase.leaveGroup(groupId, req.user!.id);
      return res.status(204).send();
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    const errorMessage = (error as Error).message;
    if (errorMessage.toLowerCase().includes("already a member")) {
      return res.status(409).json({ error: "Conflict", errorMessage });
    }
    const statusCode =
      errorMessage.toLowerCase().includes("not found") ||
      errorMessage.toLowerCase().includes("not a member")
        ? 404
        : 500;
    return res.status(statusCode).json({
      error: statusCode === 404 ? "Not Found" : "Internal Server Error",
      errorMessage,
    });
  }
}
