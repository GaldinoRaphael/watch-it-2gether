import type { Group } from '../entities/Group';

export interface GroupRepository {
  listAll(): Promise<Group[]>;
  getById(id: string): Promise<Group>;
  create(name: string, ownerId: string): Promise<Group>;
}
