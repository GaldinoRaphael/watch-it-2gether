import { Router } from "express";
import { VoteController } from "../controllers/vote-controller";
import { VoteUseCase } from "../../../application/useCases/vote-use-case";
import { IMDBApiClient } from "../../gateways/imdb-api-client";
import { MovieRepositoryImpl } from "../../../ports/repositories/movie-repository-impl";
import { VoteRepositoryImpl } from "../../../ports/repositories/vote-repository-impl";
import { prismaService } from "../../database/prisma/client/prisma.service";

const router = Router();

const voteRepository = new VoteRepositoryImpl(prismaService);
const movieRepository = new MovieRepositoryImpl(prismaService);
const gateWay = new IMDBApiClient();
const useCase = new VoteUseCase(voteRepository, movieRepository, gateWay);
const controller = new VoteController(useCase)

router.post('/vote', (req, res) => controller.voteMovie(req, res));

export default router;