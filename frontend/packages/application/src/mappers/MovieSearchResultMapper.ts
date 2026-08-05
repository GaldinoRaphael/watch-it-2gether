import type { MovieSearchResult } from '@watch-it/domain';
import type { MovieSearchResultDTO } from '../dto/MovieSearchResultDTO';

export const MovieSearchResultMapper = {
  toDomain(dto: MovieSearchResultDTO): MovieSearchResult {
    return {
      externalId: dto.id,
      title: dto.title,
      year: dto.year,
      posterUrl: dto.posterUrl,
    };
  },
};
