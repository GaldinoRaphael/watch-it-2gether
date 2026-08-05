import type { MovieRepository } from '@watch-it/domain';

export function makeSearchMoviesUseCase(repository: MovieRepository) {
  return (query: string) => repository.search(query);
}
