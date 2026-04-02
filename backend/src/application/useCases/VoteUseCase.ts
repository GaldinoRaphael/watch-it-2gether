import { Movie } from "../../domain/entities/Movie";
import { Vote } from "../../domain/entities/Vote";
import { MovieRepository } from "../../ports/repositories/MovieRepository";
import { VoteRepository } from "../../ports/repositories/VoteRepository";
import { MovieGateway } from "../../domain/repositories/MovieGateway";
import { ImdbMovieMapper } from "../../infrastructure/http/mappers/ImdbMovieMapper";
import { UserId } from "../../domain/value-objects/UserId";
import { Commentary } from "../../domain/entities/Commentary";
import { GroupId } from "../../domain/value-objects/GroupId";
import { MovieId } from "../../domain/value-objects/MovieId";

interface Input {
    userId: string;
    groupId: string;
    externalId: string;
    rating: number;
    commentary: string;
}

export class VoteUseCase {
    constructor(
        private voteRepository: VoteRepository,
        private movieRepository: MovieRepository,
        private movieGateway: MovieGateway){
    }

    async execute({ userId, groupId, externalId, rating, commentary }: Input) {
        // Check if vote already exists for this user, group and movie combination (not implemented here, but should be done in a real application)

        let movie = await this.movieRepository.getMovieByExternalId(externalId);

        if(!movie){
            movie = await this.searchMovieInExternalApiAndSave(externalId);
        }

        const userInternalId = UserId.create(userId);
        const groupInternalId = GroupId.create(groupId);
        const movieInternalId = MovieId.create(movie.id);

        const newCommentary = Commentary.create(userInternalId, movieInternalId, commentary);
        const newVote = Vote.create(userInternalId, groupInternalId, movieInternalId, rating, newCommentary.id);
        
        await this.voteRepository.saveComplete(newVote, newCommentary);

        return newVote;
    }

    async searchMovieInExternalApiAndSave(externalId: string) {
        const imdbMovie = await this.movieGateway.getById(externalId);
        const movieData = ImdbMovieMapper.toDomain(imdbMovie);

        const movie = Movie.create(
            movieData.externalId,
            movieData.title,
            movieData.year,
            movieData.poster
        );
        
        return await this.movieRepository.save(movie);
    }
}