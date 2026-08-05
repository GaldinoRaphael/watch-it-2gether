import { Router } from "express";
import { GroupWatchedMovieRepositoryImpl } from "../../repositories/group-watched-movie-repository-impl";
import { GroupWatchedMovieUseCase } from "../../../application/useCases/group-watched-movie-use-case";
import { GroupWatchedMovieController } from "../controllers/group-watched-movie-controller";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { authMiddleware } from "../middleware/auth-middleware";

const router = Router();

const groupWatchedMovieRepository = new GroupWatchedMovieRepositoryImpl(prismaService);
const groupWatchedMovieUseCase = new GroupWatchedMovieUseCase(groupWatchedMovieRepository);
const controller = new GroupWatchedMovieController(groupWatchedMovieUseCase);

/**
 * @openapi
 * /groups/{groupId}/watched-movies:
 *   get:
 *     summary: Lista os filmes assistidos de um grupo
 *     tags:
 *       - WatchedMovies
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do grupo
 *     responses:
 *       200:
 *         description: Lista de filmes assistidos retornada com sucesso
 *       401:
 *         description: Não autorizado
 */
router.get("/groups/:groupId/watched-movies", authMiddleware, (req, res) =>
  controller.getWatchedMoviesByGroup(req, res),
);

export default router;
