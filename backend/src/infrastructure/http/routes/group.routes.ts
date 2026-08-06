import { Router } from "express";
import { GroupRepositoryUseCase } from "../../../application/useCases/group-repository-use-case";
import { GroupRepositoryImpl } from "../../repositories/group-repository-impl";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { GroupController } from "../controllers/group-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { validate } from "../middleware/validate-middleware";
import { createGroupSchema, updateGroupSchema } from "../schemas/group.schema";
import { GroupMemberRepositoryImpl } from "../../repositories/group-member-repository-impl";

const router = Router();

const groupRepository = new GroupRepositoryImpl(prismaService);
const groupMemberRepository = new GroupMemberRepositoryImpl(prismaService);
const groupRepositoryUseCase = new GroupRepositoryUseCase(groupRepository, groupMemberRepository);
const controller = new GroupController(groupRepositoryUseCase);

/**
 * @openapi
 * /groups:
 *   get:
 *     summary: Lista todos os grupos
 *     tags:
 *       - Groups
 *     responses:
 *       200:
 *         description: Lista de grupos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 */
router.get("/groups", authMiddleware, (req, res) => controller.getGroups(req, res));

/**
 * @openapi
 * /groups/{id}:
 *   get:
 *     summary: Busca um grupo pelo ID
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Grupo encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Grupo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/groups/:id", authMiddleware, (req, res) => controller.getGroupById(req, res));

/**
 * @openapi
 * /groups:
 *   post:
 *     summary: Cria um novo grupo
 *     tags:
 *       - Groups
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGroupInput'
 *     responses:
 *       201:
 *         description: Grupo criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       500:
 *         description: Erro interno ao criar grupo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/groups", authMiddleware, validate(createGroupSchema), (req, res) =>
  controller.createGroup(req, res),
);

/**
 * @openapi
 * /groups/{id}:
 *   put:
 *     summary: Atualiza um grupo existente
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do grupo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGroupInput'
 *     responses:
 *       200:
 *         description: Grupo atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       404:
 *         description: Grupo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/groups/:id", authMiddleware, validate(updateGroupSchema), (req, res) =>
  controller.updateGroup(req, res),
);

/**
 * @openapi
 * /groups/{id}:
 *   delete:
 *     summary: Remove um grupo pelo ID
 *     tags:
 *       - Groups
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do grupo
 *     responses:
 *       204:
 *         description: Grupo removido com sucesso
 *       404:
 *         description: Grupo não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/groups/:id", authMiddleware, (req, res) => controller.deleteGroup(req, res));

export default router;
