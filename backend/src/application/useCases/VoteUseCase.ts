import { Movie } from "../../domain/entities/Movie";
import { Vote } from "../../domain/entities/Vote";
import { MovieRepository } from "../../ports/repositories/MovieRepository";
import { VoteRepository } from "../../ports/repositories/VoteRepository";
import { MovieGateway } from "../../domain/repositories/MovieGateway";
import { ImdbMovieMapper } from "../../infrastructure/http/mappers/ImdbMovieMapper";
import { VoteId } from "../../domain/value-objects/VoteId";

interface Input {
    userId: string;
    externalId: string;
    rating: number;
}

export class VoteUseCase {
    constructor(
        private voteRepository: VoteRepository,
        private movieRepository: MovieRepository,
        private movieGateway: MovieGateway){
    }

    async execute({ userId, externalId, rating }: Input) {
        const existingVote = await this.voteRepository
            .findByUserIdAndExternalId(userId, externalId);

        if (existingVote) return existingVote.id;

        const imdbMovie = await this.movieGateway.getById(externalId);
        const movieData = ImdbMovieMapper.toDomain(imdbMovie);

        const movie = Movie.createdFromExternalData(movieData);

        const newVote = new Vote(VoteId.generate(), `1`, movie.id, rating);
        
        await this.voteRepository.save(newVote);
    }
}