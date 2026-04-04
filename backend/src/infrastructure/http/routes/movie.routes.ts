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

router.get('/movies/search', (req, res) => controller.search(req, res));
router.get('/movies/db', (req, res) => controller.getStoredMovies(req, res));
router.get('/movies/db/external/:externalId', (req, res) => controller.getStoredMovieByExternalId(req, res));
router.get('/movies/db/:id', (req, res) => controller.getStoredMovieById(req, res));
router.post('/movies/db', (req, res) => controller.createStoredMovie(req, res));
router.put('/movies/db/:id', (req, res) => controller.updateStoredMovie(req, res));
router.delete('/movies/db/:id', (req, res) => controller.deleteStoredMovie(req, res));
router.get('/movies/:id', (req, res) => controller.getById(req, res));

export default router;
