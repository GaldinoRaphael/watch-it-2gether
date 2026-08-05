import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { makeSearchMoviesUseCase } from '@watch-it/application';
import { httpMovieRepository } from '@watch-it/infrastructure';

const searchMovies = makeSearchMoviesUseCase(httpMovieRepository);

export function useMovieSearch(rawQuery: string) {
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(rawQuery.trim());
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [rawQuery]);

  return useQuery({
    queryKey: ['movies-search', debouncedQuery],
    queryFn: () => searchMovies(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 30_000,
  });
}
