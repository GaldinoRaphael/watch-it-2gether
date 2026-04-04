import { MovieEntity } from "../../domain/entities/movie-entity";
import { VoteEntity } from "../../domain/entities/vote-entity";
import { MovieGateway } from "../../domain/repositories/MovieGateway";
import { ImdbMovieMapper } from "../../infrastructure/http/mappers/imdb-movie-mapper";
import { UserId } from "../../domain/value-objects/UserId";
import { Commentary } from "../../domain/entities/Commentary";
import { GroupId } from "../../domain/value-objects/GroupId";
import { MovieId } from "../../domain/value-objects/MovieId";
import { VoteId } from "../../domain/value-objects/VoteId";
import { MovieRepository } from "../../ports/repositories/interfaces/movie-repository";
import { VoteRepository } from "../../ports/repositories/interfaces/vote-repository";
import { VoteDTO } from "../dto/VoteDTO";
import { movieMapper } from "../../infrastructure/http/mappers/movie-mapper";

interface Input {
    userId: string;
    groupId: string;
    externalId: string;
    rating: number;
    commentary: string;
    voteId?: string;
}

export class VoteUseCase {
    constructor(
        private voteRepository: VoteRepository,
        private movieRepository: MovieRepository,
        private movieGateway: MovieGateway){
    }

    async execute({ userId, groupId, externalId, rating, commentary, voteId = ""}: Input) {

        let existingVote = voteId ? await this.voteRepository.getByID(voteId) : null;

        if(existingVote) {
            const updatedVote = await this.updateExistingVote(existingVote, rating, commentary);
            return updatedVote;
        }
        
        let movie = await this.movieRepository.getMovieByExternalId(externalId);

        if(!movie){
            movie = await this.searchMovieInExternalApiAndSave(externalId);
        }

        const userInternalId = UserId.create(userId);
        const groupInternalId = GroupId.create(groupId);
        const movieInternalId = MovieId.create(movie.id);
        const voteInternalId = VoteId.generate();

        const newCommentary = Commentary.create(userInternalId, voteInternalId, commentary);
        const newVote = new VoteEntity(voteInternalId, userInternalId, groupInternalId, movieInternalId, rating, newCommentary.id);
        
        await this.voteRepository.saveComplete(newVote, newCommentary);

        return newVote;
    }

    async updateExistingVote(existingVote: VoteDTO, rating: number, commentary: string) {
        return await this.voteRepository.updateComplete(
            existingVote.id,
            rating,
            Commentary.restore(
                existingVote.commentaryId,
                existingVote.userId,
                existingVote.id,
                commentary,
                new Date().toISOString(),
            )
        );
    }

    async searchMovieInExternalApiAndSave(externalId: string) {
        const imdbMovie = await this.movieGateway.getById(externalId);
        const movieData = ImdbMovieMapper.toDomain(imdbMovie);

        const movie = MovieEntity.create(
            movieData.externalId,
            movieData.title,
            movieData.year,
            movieData.poster
        );

        const movieDto = movieMapper.entityToDTO(movie);
    
        return await this.movieRepository.save(movieDto);
    }
}