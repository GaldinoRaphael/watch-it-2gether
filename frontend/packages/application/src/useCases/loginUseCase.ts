import type { AuthRepository } from '@watch-it/domain';

export function makeLoginUseCase(repository: AuthRepository) {
  return async function login(email: string, password: string) {
    return repository.login(email, password);
  };
}
