import { Router } from "express";
import { IMDBApiClient } from "../../gateways/imdb-api-client";
import { SearchMoviesUseCase } from "../../../application/useCases/search-movie-use-case";
import { MovieController } from "../controllers/movie-controller";

const router = Router();

const gateway = new IMDBApiClient();
const useCase = new SearchMoviesUseCase(gateway);
const controller = new MovieController(useCase);

router.get('/movies/search', (req, res) => controller.search(req, res));
router.get('/movies/:id', (req, res) => controller.getById(req, res));

export default router;
