import { Router } from "express";
import { CreateGroupInviteUseCase } from "../../../application/useCases/create-group-invite-use-case";
import { GroupInviteController } from "../controllers/group-invite-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { GroupInviteRepositoryImpl } from "../../repositories/group-invite-repository-impl";
import { GroupRepositoryImpl } from "../../repositories/group-repository-impl";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { AcceptGroupInviteUseCase } from "../../../application/useCases/accept-group-invite-use-case";
import { GroupMemberRepositoryImpl } from "../../repositories/group-member-repository-impl";

const router = Router();

const groupInviteRepository = new GroupInviteRepositoryImpl(prismaService);
const groupRepository = new GroupRepositoryImpl(prismaService);
const groupMemberRepository = new GroupMemberRepositoryImpl(prismaService);
const createGroupInviteUseCase = new CreateGroupInviteUseCase(
  groupInviteRepository,
  groupRepository,
);
const acceptGroupInviteUseCase = new AcceptGroupInviteUseCase(
  groupInviteRepository,
  groupRepository,
  groupMemberRepository,
);
const controller = new GroupInviteController(createGroupInviteUseCase, acceptGroupInviteUseCase);

router.post("/groups/:groupId/invite", authMiddleware, (req, res) =>
  controller.createGroupInvite(req, res),
);

router.post("/groups/invite/:token/accept", authMiddleware, (req, res) =>
  controller.acceptGroupInvite(req, res),
);

export default router;