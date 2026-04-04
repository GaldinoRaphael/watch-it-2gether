import { Router } from "express";
import { GroupRepositoryUseCase } from "../../../application/useCases/group-repository-use-case";
import { GroupRepositoryImpl } from "../../../ports/repositories/group-repository-impl";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { GroupController } from "../controllers/group-controller";

const router = Router();

const groupRepository = new GroupRepositoryImpl(prismaService);
const groupRepositoryUseCase = new GroupRepositoryUseCase(groupRepository);
const controller = new GroupController(groupRepositoryUseCase);

router.get('/groups', (req, res) => controller.getGroups(req, res));
router.get('/groups/:id', (req, res) => controller.getGroupById(req, res));
router.post('/groups', (req, res) => controller.createGroup(req, res));
router.put('/groups/:id', (req, res) => controller.updateGroup(req, res));
router.delete('/groups/:id', (req, res) => controller.deleteGroup(req, res));

export default router;