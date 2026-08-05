import { MovieEntity } from "../../domain/entities/movie-entity";
import { VoteEntity } from "../../domain/entities/vote-entity";
import type { MovieGateway } from "../../domain/repositories/MovieGateway";
import { UserId } from "../../domain/value-objects/user-id";
import { Commentary } from "../../domain/entities/commentary-entity";
import { GroupId } from "../../domain/value-objects/group-id";
import { MovieId } from "../../domain/value-objects/movie-id";
import { VoteId } from "../../domain/value-objects/vote-id";
import type { VoteDTO } from "../dto/VoteDTO";
import { movieMapper } from "../../infrastructure/http/mappers/movie-mapper";
import { VoteMapper } from "../../infrastructure/http/mappers/vote-mapper";
import type { MovieRepository } from "../../ports/repositories/movie-repository";
import type { VoteRepository } from "../../ports/repositories/vote-repository";
import type { Vote } from "../../infrastructure/database/prisma/generated";
import type { Commentary as PrismaCommentary } from "../../infrastructure/database/prisma/generated";

interface Input {
  userId: string;
  groupId: string;
  externalId: string;
  movieTitle?: string;
  posterUrl?: string;
  rating: number;
  commentary: string;
  voteId?: string;
}

export class VoteUseCase {
  constructor(
    private voteRepository: VoteRepository,
    private movieRepository: MovieRepository,
    private movieGateway: MovieGateway,
  ) {}

  async execute({
    userId,
    groupId,
    externalId,
    movieTitle,
    posterUrl,
    rating,
    commentary,
    voteId = "",
  }: Input): Promise<VoteDTO> {
    const existingVote = voteId ? await this.voteRepository.findByID(voteId) : null;

    if (existingVote) {
      const existingVoteDto = VoteMapper.modelToDto(
        existingVote as Vote & { commentary: PrismaCommentary[] },
      );
      return this.updateExistingVote(existingVoteDto, rating, commentary);
    }

    let movie = await this.movieRepository.getMovieByExternalId(externalId);

    if (!movie) {
      movie = await this.searchMovieInExternalApiAndSave(externalId, movieTitle, posterUrl);
    }

    const userInternalId = UserId.create(userId);
    const groupInternalId = GroupId.create(groupId);
    const movieInternalId = MovieId.create(movie.id);
    const voteInternalId = VoteId.generate();

    const newCommentary = Commentary.create(userInternalId, voteInternalId, commentary);
    const newVote = new VoteEntity(
      voteInternalId,
      userInternalId,
      groupInternalId,
      movieInternalId,
      rating,
      newCommentary.id,
    );

    const savedVote = await this.voteRepository.saveComplete(newVote, newCommentary);
    return VoteMapper.modelToDto(savedVote as Vote & { commentary: PrismaCommentary[] });
  }

  async updateExistingVote(
    existingVote: VoteDTO,
    rating: number,
    commentary: string,
  ): Promise<VoteDTO> {
    const updated = await this.voteRepository.updateComplete(
      existingVote.id,
      rating,
      Commentary.restore(
        existingVote.commentaryId,
        existingVote.userId,
        existingVote.id,
        commentary,
        new Date().toISOString(),
      ),
    );
    return VoteMapper.modelToDto(updated as Vote & { commentary: PrismaCommentary[] });
  }

  async searchMovieInExternalApiAndSave(
    externalId: string,
    movieTitle?: string,
    posterUrl?: string,
  ): Promise<{
    id: string;
    externalId: string;
    title: string;
    year: string;
    posterUrl: string | null;
    provider: string | null;
    createdAt: Date;
  }> {
    const movieData = await this.movieGateway.getById(externalId);

    const normalizedTitle = movieTitle?.trim() ? movieTitle.trim() : movieData.title;
    const normalizedPoster = posterUrl?.trim() ? posterUrl.trim() : movieData.posterUrl;

    const movie = MovieEntity.create(
      String(movieData.id || externalId),
      normalizedTitle,
      movieData.year,
      normalizedPoster || undefined,
    );

    const movieDto = movieMapper.entityToDTO(movie);
    return this.movieRepository.save(movieMapper.toDomain(movieDto));
  }
}
