import type { GroupInviteRepository } from '@watch-it/domain';

export function makeCreateGroupInviteUseCase(repository: GroupInviteRepository) {
  return (groupId: string) => repository.create(groupId);
}

export function makeGetGroupInviteUseCase(repository: GroupInviteRepository) {
  return (token: string) => repository.get(token);
}

export function makeAcceptGroupInviteUseCase(repository: GroupInviteRepository) {
  return (token: string) => repository.accept(token);
}
