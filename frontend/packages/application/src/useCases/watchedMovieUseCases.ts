import type { WatchedMovieRepository } from '@watch-it/domain';

export function makeGetWatchedMoviesUseCase(repository: WatchedMovieRepository) {
  return (groupId: string) => repository.getByGroupId(groupId);
}
