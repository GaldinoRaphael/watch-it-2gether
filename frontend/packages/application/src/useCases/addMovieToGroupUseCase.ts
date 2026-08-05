import type { AddMovieToGroupInput, MovieRepository } from '@watch-it/domain';

export function makeAddMovieToGroupUseCase(repository: MovieRepository) {
  return (input: AddMovieToGroupInput) => repository.addToGroup(input);
}
