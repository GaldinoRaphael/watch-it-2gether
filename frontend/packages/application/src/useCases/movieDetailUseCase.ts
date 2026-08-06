import type { MovieRepository } from '@watch-it/domain';

export function makeGetMovieSynopsisUseCase(repository: MovieRepository) {
  return (externalId: string) => repository.getByExternalId(externalId);
}
