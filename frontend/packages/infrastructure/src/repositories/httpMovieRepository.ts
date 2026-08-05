import { MovieSearchResultMapper } from '@watch-it/application';
import type { MovieSearchResultDTO } from '@watch-it/application';
import type { AddMovieToGroupInput, MovieRepository } from '@watch-it/domain';
import { httpClient } from '../http/httpClient';

function mapUiRatingToBackend(rating: number) {
  return Math.max(0, Math.min(10, rating * 2));
}

export const httpMovieRepository: MovieRepository = {
  async search(query) {
    const { data } = await httpClient.get<MovieSearchResultDTO[]>('/movies/search', {
      params: { query },
    });

    return data.map(MovieSearchResultMapper.toDomain);
  },
  async addToGroup(input: AddMovieToGroupInput) {
    await httpClient.post('/vote', {
      userId: input.userId,
      groupId: input.groupId,
      externalId: String(input.externalId),
      rating: mapUiRatingToBackend(input.rating),
      commentary: input.commentary ?? '',
    });
  },
};
