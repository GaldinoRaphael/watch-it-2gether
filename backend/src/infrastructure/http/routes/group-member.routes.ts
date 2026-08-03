import { Router } from "express";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { GroupMemberRepositoryImpl } from "../../repositories/group-member-repository-impl";
import { GroupMemberUseCase } from "../../../application/useCases/group-member-use-case";
import { GroupMemberController } from "../controllers/group-member-controller";
import { authMiddleware } from "../middleware/auth-middleware";

const router = Router();

const groupMemberRepository = new GroupMemberRepositoryImpl(prismaService);
const groupMemberUseCase = new GroupMemberUseCase(groupMemberRepository);
const controller = new GroupMemberController(groupMemberUseCase);

/**
 * @openapi
 * /groups/{groupId}/members:
 *   get:
 *     summary: Lista os membros de um grupo
 *     tags:
 *       - GroupMembers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de membros retornada com sucesso
 */
router.get("/groups/:groupId/members", authMiddleware, (req, res) =>
  controller.getMembers(req, res),
);

/**
 * @openapi
 * /groups/{groupId}/members:
 *   delete:
 *     summary: Sair de um grupo (usuário autenticado remove a si mesmo)
 *     tags:
 *       - GroupMembers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Saiu do grupo com sucesso
 *       404:
 *         description: Usuário não é membro do grupo
 */
router.delete("/groups/:groupId/members", authMiddleware, (req, res) =>
  controller.leaveGroup(req, res),
);

export default router;
