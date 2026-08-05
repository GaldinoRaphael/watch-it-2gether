import type { AuthRepository } from '@watch-it/domain';

export function makeRegisterUseCase(repository: AuthRepository) {
  return async function register(name: string, email: string, password: string) {
    return repository.register(name, email, password);
  };
}
