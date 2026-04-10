import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { RegisterUseCase } from "../../../application/useCases/register-use-case";
import { Bcrypter } from "../../criptography/bcrypter";
import { UserRepositoryImpl } from "../../../ports/repositories/user-repository";
import { prismaService } from "../../database/prisma/client/prisma.service";

const router = Router();
const repositorie = new UserRepositoryImpl(prismaService);
const passwordHasher = new Bcrypter();
const register = new RegisterUseCase(repositorie, passwordHasher);
const controller = new UserController(register);

router.post('/user/register', (req, res) => controller.registerUser(req, res));

export default router;