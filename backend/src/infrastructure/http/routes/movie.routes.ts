import { Router } from "express";
import { IMDBApiClient } from "../../gateways/imdb-api-client";
import { MovieRepositoryUseCase } from "../../../application/useCases/movie-repository-use-case";
import { SearchMoviesUseCase } from "../../../application/useCases/search-movie-use-case";
import { MovieController } from "../controllers/movie-controller";
import { prismaService } from "../../database/prisma/client/prisma.service";
import { MovieRepositoryImpl } from "../../../ports/repositories/movie-repository-impl";

const router = Router();

const gateway = new IMDBApiClient();
const movieRepository = new MovieRepositoryImpl(prismaService);
const searchMoviesUseCase = new SearchMoviesUseCase(gateway);
const movieRepositoryUseCase = new MovieRepositoryUseCase(movieRepository);
const controller = new MovieController(searchMoviesUseCase, movieRepositoryUseCase);

/**
 * @openapi
 * /movies/search:
 *   get:
 *     summary: Busca filmes na API externa
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Texto de busca do filme
 *     responses:
 *       200:
 *         description: Lista de filmes encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ImdbMovie'
 *       500:
 *         description: Erro interno ao buscar filmes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/movies/search', (req, res) => controller.search(req, res));

/**
 * @openapi
 * /movies/db:
 *   get:
 *     summary: Lista os filmes salvos no banco
 *     tags:
 *       - Movies
 *     responses:
 *       200:
 *         description: Lista de filmes salvos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get('/movies/db', (req, res) => controller.getStoredMovies(req, res));

/**
 * @openapi
 * /movies/db/external/{externalId}:
 *   get:
 *     summary: Busca um filme salvo pelo externalId
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: externalId
 *         required: true
 *         schema:
 *           type: string
 *         description: External ID do filme
 *     responses:
 *       200:
 *         description: Filme encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/movies/db/external/:externalId', (req, res) => controller.getStoredMovieByExternalId(req, res));

/**
 * @openapi
 * /movies/db/{id}:
 *   get:
 *     summary: Busca um filme salvo pelo ID interno
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID interno do filme
 *     responses:
 *       200:
 *         description: Filme encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/movies/db/:id', (req, res) => controller.getStoredMovieById(req, res));

/**
 * @openapi
 * /movies/db:
 *   post:
 *     summary: Salva um filme no banco
 *     tags:
 *       - Movies
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovieInput'
 *     responses:
 *       201:
 *         description: Filme salvo com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       500:
 *         description: Erro interno ao salvar filme
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/movies/db', (req, res) => controller.createStoredMovie(req, res));

/**
 * @openapi
 * /movies/db/{id}:
 *   put:
 *     summary: Atualiza um filme salvo
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID interno do filme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMovieInput'
 *     responses:
 *       200:
 *         description: Filme atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/movies/db/:id', (req, res) => controller.updateStoredMovie(req, res));

/**
 * @openapi
 * /movies/db/{id}:
 *   delete:
 *     summary: Remove um filme salvo
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID interno do filme
 *     responses:
 *       204:
 *         description: Filme removido com sucesso
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/movies/db/:id', (req, res) => controller.deleteStoredMovie(req, res));

/**
 * @openapi
 * /movies/{id}:
 *   get:
 *     summary: Busca detalhes de um filme na API externa pelo ID
 *     tags:
 *       - Movies
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID externo do filme
 *     responses:
 *       200:
 *         description: Filme encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImdbMovie'
 *       404:
 *         description: Filme não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/movies/:id', (req, res) => controller.getById(req, res));

export default router;
