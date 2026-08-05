import type { GroupRepository } from '@watch-it/domain';

export function makeListGroupsUseCase(repository: GroupRepository) {
  return () => repository.listAll();
}

export function makeGetGroupUseCase(repository: GroupRepository) {
  return (id: string) => repository.getById(id);
}

export function makeCreateGroupUseCase(repository: GroupRepository) {
  return (name: string, ownerId: string) => repository.create(name, ownerId);
}
