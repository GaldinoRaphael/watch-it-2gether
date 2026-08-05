import type { UserRepository, UserProfile } from '@watch-it/domain';

export function makeGetProfileUseCase(repository: UserRepository) {
  return async function getProfile(): Promise<UserProfile> {
    return repository.getProfile();
  };
}

export function makeGetTotalRatingsUseCase(repository: UserRepository) {
  return async function getTotalRatings(userId: string): Promise<number> {
    return repository.getTotalRatings(userId);
  };
}
