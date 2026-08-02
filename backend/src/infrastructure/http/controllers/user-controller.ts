import type { RegisterUseCase } from "../../../application/useCases/register-use-case";
import type { Request, Response } from "express";

import type { LoginUseCase } from "../../../application/useCases/login-use-case";
import type { UserProfileUseCase } from "../../../application/useCases/user-profile-use-case";

export class UserController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly userProfileUseCase: UserProfileUseCase) {}

  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body as { name: string; email: string; password: string };
      await this.registerUseCase.execute({ name, email, password });
      const userAuthenticatedDTO = await this.loginUseCase.execute({ email, password });
      return res.status(201).json(userAuthenticatedDTO);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async loginUser(req: Request, res: Response) {
      try {
        const { email, password } = req.body as { email: string; password: string };
        const userAuthenticatedDTO = await this.loginUseCase.execute({ email, password });
        return res.status(200).json(userAuthenticatedDTO);
      } catch (error) {
        return this.handleError(res, error);
      }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const profile = await this.userProfileUseCase.getProfile(req.user.id);
      return res.json(profile);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    const errorMessage = (error as Error).message;
    if (errorMessage.toLowerCase().includes("email already in use")) {
      return res.status(409).json({ error: "Conflict", errorMessage });
    }
    const statusCode = errorMessage.toLowerCase().includes("not found") ? 404 : 500;

    return res.status(statusCode).json({
      error: statusCode === 404 ? "Not Found" : "Internal Server Error",
      errorMessage,
    });
  }
}
