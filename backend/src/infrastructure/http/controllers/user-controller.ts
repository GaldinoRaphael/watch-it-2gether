import { RegisterUseCase } from "../../../application/useCases/register-use-case";
import { Request, Response } from "express";

export class UserController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await this.registerUseCase.execute({ name, email, password });
      return res.status(201).json(user);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  private handleError(res: Response, error: unknown) {
    const errorMessage = (error as Error).message;
    const statusCode = errorMessage.toLowerCase().includes("not found")
      ? 404
      : 500;

    return res.status(statusCode).json({
      error: statusCode === 404 ? "Not Found" : "Internal Server Error",
      errorMessage,
    });
  }
}
