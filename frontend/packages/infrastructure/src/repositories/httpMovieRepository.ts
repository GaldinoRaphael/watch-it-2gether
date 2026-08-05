import { MovieSearchResultMapper } from '@watch-it/application';
import type { MovieSearchResultDTO } from '@watch-it/application';
import type { AddMovieToGroupInput, MovieRepository } from '@watch-it/domain';
import { httpClient } from '../http/httpClient';

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
      movieTitle: input.movieTitle,
      posterUrl: input.posterUrl,
      provider: input.provider,
      rating: input.rating,
      commentary: input.commentary ?? '',
    });
  },
};
