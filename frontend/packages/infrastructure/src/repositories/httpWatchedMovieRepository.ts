import { WatchedMovieMapper } from '@watch-it/application';
import type { WatchedMovieDTO } from '@watch-it/application';
import type { WatchedMovieRepository } from '@watch-it/domain';
import { httpClient } from '../http/httpClient';

export const httpWatchedMovieRepository: WatchedMovieRepository = {
  async getByGroupId(groupId: string) {
    const { data } = await httpClient.get<WatchedMovieDTO[]>(`/groups/${groupId}/watched-movies`);
    return data.map(WatchedMovieMapper.toDomain);
  },
};
