import { useQuery } from '@tanstack/react-query';
import { makeGetMovieSynopsisUseCase } from '@watch-it/application';
import { httpMovieRepository } from '@watch-it/infrastructure';

const getMovieSynopsis = makeGetMovieSynopsisUseCase(httpMovieRepository);

export function useMovieSynopsis(externalId: string | undefined, enabled = false) {
  return useQuery({
    queryKey: ['movie-synopsis', externalId],
    queryFn: () => getMovieSynopsis(externalId as string),
    enabled: Boolean(externalId) && enabled,
    staleTime: 10 * 60 * 1000,
  });
}
