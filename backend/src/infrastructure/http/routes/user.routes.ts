import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { UserController } from "../controllers/user-controller";
import { RegisterUseCase } from "../../../application/useCases/register-use-case";
import { Bcrypter } from "../../criptography/bcrypter";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { LoginUseCase } from "../../../application/useCases/login-use-case";
import { UserProfileUseCase } from "../../../application/useCases/user-profile-use-case";
import { authMiddleware } from "../middleware/auth-middleware";
import { validate } from "../middleware/validate-middleware";
import { registerSchema, loginSchema } from "../schemas/user.schema";
import { UserRepositoryImpl } from "../../repositories/user-repository-impl";

// Prevents brute-force attacks on credentials
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();
const repositorie = new UserRepositoryImpl(prismaService);
const passwordHasher = new Bcrypter();
const register = new RegisterUseCase(repositorie, passwordHasher);
const login = new LoginUseCase(repositorie, passwordHasher);
const userProfile = new UserProfileUseCase(repositorie);
const controller = new UserController(register, login, userProfile);

router.post("/user/register", registerLimiter, validate(registerSchema), (req, res) =>
  controller.registerUser(req, res),
);
router.post("/user/login", loginLimiter, validate(loginSchema), (req, res) =>
  controller.loginUser(req, res),
);

/**
 * @openapi
 * /user/me:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *       401:
 *         description: Token inválido ou ausente
 */
router.get("/user/me", authMiddleware, (req, res) => controller.getProfile(req, res));
router.get("/user/:id", authMiddleware, (req, res) => controller.getUserById(req, res));

export default router;
