import { MovieEntity } from "../../domain/entities/movie-entity";
import { VoteEntity } from "../../domain/entities/vote-entity";
import { MovieGateway } from "../../domain/repositories/MovieGateway";
import { ImdbMovieMapper } from "../../infrastructure/http/mappers/imdb-movie-mapper";
import { UserId } from "../../domain/value-objects/user-id";
import { Commentary } from "../../domain/entities/commentary-entity";
import { GroupId } from "../../domain/value-objects/group-id";
import { MovieId } from "../../domain/value-objects/movie-id";
import { VoteId } from "../../domain/value-objects/vote-id";

import { VoteDTO } from "../dto/VoteDTO";
import { movieMapper } from "../../infrastructure/http/mappers/movie-mapper";
import { MovieRepository } from "../../ports/repositories/movie-repository";
import { VoteRepository } from "../../ports/repositories/vote-repository";

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

    async execute({ userId, groupId, externalId, rating, commentary, voteId = ""}: Input): Promise<VoteDTO> {

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
        
        const savedVote = await this.voteRepository.saveComplete(newVote, newCommentary);

        return savedVote;
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