import { Router } from "express";
import { GroupRepositoryUseCase } from "../../../application/useCases/group-repository-use-case";
import { GroupRepositoryImpl } from "../../../ports/repositories/group-repository-impl";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { GroupController } from "../controllers/group-controller";

const router = Router();

const groupRepository = new GroupRepositoryImpl(prismaService);
const groupRepositoryUseCase = new GroupRepositoryUseCase(groupRepository);
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
router.get('/groups', (req, res) => controller.getGroups(req, res));

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
router.get('/groups/:id', (req, res) => controller.getGroupById(req, res));

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
router.post('/groups', (req, res) => controller.createGroup(req, res));

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
router.put('/groups/:id', (req, res) => controller.updateGroup(req, res));

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
router.delete('/groups/:id', (req, res) => controller.deleteGroup(req, res));

export default router;