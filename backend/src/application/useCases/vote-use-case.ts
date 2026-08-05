import { MovieEntity } from "../../domain/entities/movie-entity";
import { VoteEntity } from "../../domain/entities/vote-entity";
import type { MovieGateway } from "../../domain/repositories/MovieGateway";
import { UserId } from "../../domain/value-objects/user-id";
import { GroupId } from "../../domain/value-objects/group-id";
import { MovieId } from "../../domain/value-objects/movie-id";
import { VoteId } from "../../domain/value-objects/vote-id";
import type { VoteDTO } from "../dto/VoteDTO";
import { movieMapper } from "../../infrastructure/http/mappers/movie-mapper";
import { VoteMapper } from "../../infrastructure/http/mappers/vote-mapper";
import type { MovieRepository } from "../../ports/repositories/movie-repository";
import type { VoteRepository } from "../../ports/repositories/vote-repository";
import type { GroupWatchedMovieRepository } from "../../ports/repositories/group-watched-movie-repository";
import type { Vote } from "../../infrastructure/database/prisma/generated";

interface Input {
  userId: string;
  groupId: string;
  externalId: string;
  movieTitle?: string;
  posterUrl?: string;
  provider?: string;
  rating: number;
  commentary: string;
  voteId?: string;
}

export class VoteUseCase {
  constructor(
    private voteRepository: VoteRepository,
    private movieRepository: MovieRepository,
    private movieGateway: MovieGateway,
    private groupWatchedMovieRepository: GroupWatchedMovieRepository,
  ) {}

  async execute({
    userId,
    groupId,
    externalId,
    movieTitle,
    posterUrl,
    provider,
    rating,
    commentary,
    voteId = "",
  }: Input): Promise<VoteDTO> {
    const existingVote = voteId ? await this.voteRepository.findByID(voteId) : null;

    if (existingVote) {
      const existingVoteDto = VoteMapper.modelToDto(existingVote as Vote);
      return this.updateExistingVote(existingVoteDto, rating, commentary);
    }

    let movie = await this.movieRepository.getMovieByExternalId(externalId);

    if (!movie) {
      movie = await this.searchMovieInExternalApiAndSave(externalId, movieTitle, posterUrl, provider);
    }

    const userInternalId = UserId.create(userId);
    const groupInternalId = GroupId.create(groupId);
    const movieInternalId = MovieId.create(movie.id);
    const voteInternalId = VoteId.generate();

    const newVote = new VoteEntity(
      voteInternalId,
      userInternalId,
      groupInternalId,
      movieInternalId,
      rating,
    );

    const savedVote = await this.voteRepository.saveComplete(newVote, commentary);
    await this.groupWatchedMovieRepository.upsert(groupId, movie.id);
    return VoteMapper.modelToDto(savedVote as Vote);
  }

  async updateExistingVote(
    existingVote: VoteDTO,
    rating: number,
    commentary: string,
  ): Promise<VoteDTO> {
    const updated = await this.voteRepository.updateComplete(
      existingVote.id,
      rating,
      commentary,
    );
    return VoteMapper.modelToDto(updated as Vote);
  }

  async searchMovieInExternalApiAndSave(
    externalId: string,
    movieTitle?: string,
    posterUrl?: string,
    provider?: string,
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
    const normalizedProvider = provider?.trim() ? provider.trim() : movieData.provider;

    const movie = MovieEntity.create(
      String(movieData.id || externalId),
      normalizedTitle,
      movieData.year,
      normalizedPoster || undefined,
      normalizedProvider || undefined,
    );

    const movieDto = movieMapper.entityToDTO(movie);
    return this.movieRepository.save(movieMapper.toDomain(movieDto));
  }
}
