import { useQuery } from '@tanstack/react-query';
import { makeGetWatchedMoviesUseCase } from '@watch-it/application';
import { httpWatchedMovieRepository } from '@watch-it/infrastructure';

const getWatchedMovies = makeGetWatchedMoviesUseCase(httpWatchedMovieRepository);

export function useWatchedMovies(groupId?: string) {
  return useQuery({
    queryKey: ['watched-movies', groupId],
    queryFn: () => getWatchedMovies(groupId as string),
    enabled: Boolean(groupId),
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
