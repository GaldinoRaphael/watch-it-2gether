import { Router } from "express";
import { GroupInviteController } from "../controllers/group-invite-controller";
import { authMiddleware } from "../middleware/auth-middleware";
import { GroupInviteRepositoryImpl } from "../../repositories/group-invite-repository-impl";
import { GroupRepositoryImpl } from "../../repositories/group-repository-impl";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { GroupMemberRepositoryImpl } from "../../../infrastructure/repositories/group-member-repository-impl";
import { AcceptGroupInviteUseCase } from "../../../application/useCases/group-invite/accept-group-invite-use-case";
import { CreateGroupInviteUseCase } from "../../../application/useCases/group-invite/create-group-invite-use-case";
import { GetGroupInviteUseCase } from "../../../application/useCases/group-invite/get-group-invite-use-case";

const router = Router();

const groupInviteRepository = new GroupInviteRepositoryImpl(prismaService);
const groupRepository = new GroupRepositoryImpl(prismaService);
const groupMemberRepository = new GroupMemberRepositoryImpl(prismaService);
const getGroupInviteUseCase = new GetGroupInviteUseCase(
  groupInviteRepository,
  groupRepository,
  groupMemberRepository,
);
const createGroupInviteUseCase = new CreateGroupInviteUseCase(
  groupInviteRepository,
  groupRepository,
);
const acceptGroupInviteUseCase = new AcceptGroupInviteUseCase(
  groupInviteRepository,
  groupRepository,
  groupMemberRepository,
);
const controller = new GroupInviteController(createGroupInviteUseCase, acceptGroupInviteUseCase, getGroupInviteUseCase);

router.post("/groups/invite/:groupId", authMiddleware, (req, res) =>
  controller.createGroupInvite(req, res),
);

router.get("/groups/invite/:token", (req, res) =>
  controller.getGroupInvite(req, res),
); 

router.post("/groups/invite/:token/accept", authMiddleware, (req, res) =>
  controller.acceptGroupInvite(req, res),
);

export default router;