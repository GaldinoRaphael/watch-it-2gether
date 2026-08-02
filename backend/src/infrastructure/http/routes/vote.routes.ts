import { Router } from "express";
import { VoteRepositoryUseCase } from "../../../application/useCases/vote-repository-use-case";
import { VoteController } from "../controllers/vote-controller";
import { VoteUseCase } from "../../../application/useCases/vote-use-case";
import { IMDBApiClient } from "../../gateways/imdb-api-client";
import { MovieRepositoryImpl } from "../../repositories/movie-repository-impl";
import { VoteRepositoryImpl } from "../../repositories/vote-repository-impl";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { authMiddleware } from "../middleware/auth-middleware";
import { validate } from "../middleware/validate-middleware";
import { createVoteSchema, updateVoteSchema, voteMovieSchema } from "../schemas/vote.schema";

const router = Router();

const voteRepository = new VoteRepositoryImpl(prismaService);
const movieRepository = new MovieRepositoryImpl(prismaService);
const gateWay = new IMDBApiClient();
const voteUseCase = new VoteUseCase(voteRepository, movieRepository, gateWay);
const voteRepositoryUseCase = new VoteRepositoryUseCase(voteRepository);
const controller = new VoteController(voteUseCase, voteRepositoryUseCase)

/**
 * @openapi
 * /votes:
 *   get:
 *     summary: Lista todos os votos
 *     tags:
 *       - Votes
 *     responses:
 *       200:
 *         description: Lista de votos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vote'
 */
router.get('/votes', (req, res) => controller.getVotes(req, res));

/**
 * @openapi
 * /groups/{groupId}/votes:
 *   get:
 *     summary: Lista os votos de um grupo ordenados por rating
 *     tags:
 *       - Votes
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
 *         description: Lista de votos do grupo retornada com sucesso
 */
router.get('/groups/:groupId/votes', authMiddleware, (req, res) => controller.getVotesByGroup(req, res));

/**
 * @openapi
 * /votes/{id}:
 *   get:
 *     summary: Busca um voto pelo ID
 *     tags:
 *       - Votes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do voto
 *     responses:
 *       200:
 *         description: Voto encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vote'
 *       404:
 *         description: Voto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/votes/:id', (req, res) => controller.getVoteById(req, res));

/**
 * @openapi
 * /votes:
 *   post:
 *     summary: Cria um voto diretamente no banco
 *     tags:
 *       - Votes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVoteInput'
 *     responses:
 *       201:
 *         description: Voto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vote'
 *       500:
 *         description: Erro interno ao criar voto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/votes', authMiddleware, validate(createVoteSchema), (req, res) => controller.createVote(req, res));

/**
 * @openapi
 * /votes/{id}:
 *   put:
 *     summary: Atualiza um voto existente
 *     tags:
 *       - Votes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do voto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVoteInput'
 *     responses:
 *       200:
 *         description: Voto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vote'
 *       404:
 *         description: Voto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/votes/:id', authMiddleware, validate(updateVoteSchema), (req, res) => controller.updateVote(req, res));

/**
 * @openapi
 * /votes/{id}:
 *   delete:
 *     summary: Remove um voto pelo ID
 *     tags:
 *       - Votes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do voto
 *     responses:
 *       204:
 *         description: Voto removido com sucesso
 *       404:
 *         description: Voto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/votes/:id', authMiddleware, (req, res) => controller.deleteVote(req, res));

/**
 * @openapi
 * /vote:
 *   post:
 *     summary: Registra o voto de um filme usando externalId
 *     tags:
 *       - Votes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteMovieInput'
 *     responses:
 *       200:
 *         description: Voto processado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vote'
 *       500:
 *         description: Erro interno ao votar no filme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/vote', authMiddleware, validate(voteMovieSchema), (req, res) => controller.voteMovie(req, res));

/**
 * @openapi
 * /vote/{id}:
 *   put:
 *     summary: Atualiza um voto existente usando o endpoint de votação
 *     tags:
 *       - Votes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do voto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoteMovieInput'
 *     responses:
 *       200:
 *         description: Voto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vote'
 *       404:
 *         description: Voto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/vote/:id', authMiddleware, validate(voteMovieSchema), (req, res) => controller.voteMovie(req, res));

export default router;