import { Router } from "express";
import { VoteRepositoryUseCase } from "../../../application/useCases/vote-repository-use-case";
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
const voteUseCase = new VoteUseCase(voteRepository, movieRepository, gateWay);
const voteRepositoryUseCase = new VoteRepositoryUseCase(voteRepository);
const controller = new VoteController(voteUseCase, voteRepositoryUseCase)

router.get('/votes', (req, res) => controller.getVotes(req, res));
router.get('/votes/:id', (req, res) => controller.getVoteById(req, res));
router.post('/votes', (req, res) => controller.createVote(req, res));
router.put('/votes/:id', (req, res) => controller.updateVote(req, res));
router.delete('/votes/:id', (req, res) => controller.deleteVote(req, res));
router.post('/vote', (req, res) => controller.voteMovie(req, res));
router.put('/vote/:id', (req, res) => controller.voteMovie(req, res));

export default router;