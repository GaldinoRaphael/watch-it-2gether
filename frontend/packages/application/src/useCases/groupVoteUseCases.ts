import type { VoteRepository } from '@watch-it/domain';

export function makeGetGroupVotesUseCase(repo: VoteRepository) {
  return (groupId: string) => repo.getByGroupId(groupId);
}
