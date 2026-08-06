import type { WatchedMovie } from '@watch-it/domain';
import type { WatchedMovieDTO } from '../dto/WatchedMovieDTO';

export const WatchedMovieMapper = {
  toDomain(dto: WatchedMovieDTO): WatchedMovie {
    return {
      id: dto.id,
      groupId: dto.groupId,
      movieId: dto.movieId,
      includedAt: new Date(dto.includedAt),
      title: dto.title,
      year: dto.year,
      externalId: dto.externalId,
      posterUrl: dto.posterUrl,
      provider: dto.provider,
      averageRating: dto.averageRating,
    };
  },
};
