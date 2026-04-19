import { RegisterUseCase } from "../../../application/useCases/register-use-case";
import { Request, Response } from "express";
import { UserMapper } from "../mappers/user-mapper";
import { LoginUseCase } from "../../../application/useCases/login-use-case";

export class UserController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase) {}

  async registerUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const userDTO = await this.registerUseCase.execute({ name, email, password });
      const userAuthenticatedDTO = await this.loginUseCase.execute({ email, password });
      return res.status(201).json(userAuthenticatedDTO);
    } catch (error) {
      return this.handleError(res, error);
    }
  }

  async loginUser(req: Request, res: Response) {
      try {
        const { email, password } = req.body;
        const userAuthenticatedDTO = await this.loginUseCase.execute({ email, password });
        return res.status(200).json(userAuthenticatedDTO);
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
