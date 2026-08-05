import { GroupMapper } from '@watch-it/application';
import type { GroupDTO } from '@watch-it/application';
import type { GroupRepository } from '@watch-it/domain';
import { httpClient } from '../http/httpClient';

export const httpGroupRepository: GroupRepository = {
  async listAll() {
    const { data } = await httpClient.get<GroupDTO[]>('/groups');
    return data.map(GroupMapper.toDomain);
  },
  async getById(id) {
    const { data } = await httpClient.get<GroupDTO>(`/groups/${id}`);
    return GroupMapper.toDomain(data);
  },
  async create(name, ownerId) {
    const { data } = await httpClient.post<GroupDTO>('/groups', { name, ownerId });
    return GroupMapper.toDomain(data);
  },
};
