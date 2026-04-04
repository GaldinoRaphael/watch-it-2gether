import { Request, Response } from "express";
import {
    CreateGroupInput,
    GroupRepositoryUseCase,
    UpdateGroupInput,
} from "../../../application/useCases/group-repository-use-case";

export class GroupController {
    constructor(private readonly groupRepositoryUseCase: GroupRepositoryUseCase) {}

    async getGroups(req: Request, res: Response) {
        try {
            const groups = await this.groupRepositoryUseCase.getAll();
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

    async createGroup(req: Request<{}, {}, CreateGroupInput>, res: Response) {
        try {
            const group = await this.groupRepositoryUseCase.create(req.body);
            return res.status(201).json(group);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async updateGroup(req: Request<{ id: string }, {}, UpdateGroupInput>, res: Response) {
        try {
            const group = await this.groupRepositoryUseCase.update(String(req.params.id), req.body);
            return res.json(group);
        } catch (error) {
            return this.handleError(res, error);
        }
    }

    async deleteGroup(req: Request, res: Response) {
        try {
            await this.groupRepositoryUseCase.delete(String(req.params.id));
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