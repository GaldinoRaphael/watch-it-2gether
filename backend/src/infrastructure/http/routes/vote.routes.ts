import { Router } from "express";
import { VoteController } from "../controllers/VoteController";
import { VoteUseCase } from "../../../application/useCases/VoteUseCase";
import { IMDBApiClient } from "../../../infrastructure/gateways/IMDBApiClient";
import { MovieRepositoryImpl } from "../../../ports/repositories/MovieRepositoryImpl";
import { VoteRepositoryImpl } from "../../../ports/repositories/VoteRepositoryImpl";

const router = Router();

const voteRepository = new VoteRepositoryImpl();
const movieRepository = new MovieRepositoryImpl();
const gateWay = new IMDBApiClient();
const useCase = new VoteUseCase(voteRepository, movieRepository, gateWay);
const controller = new VoteController(useCase)

router.post('/vote', (req, res) => controller.voteMovie(req, res));

export default router;