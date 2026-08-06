import { GroupVoteMapper } from '@watch-it/application';
import type { GroupVoteDTO } from '@watch-it/application';
import type { VoteRepository } from '@watch-it/domain';
import { httpClient } from '../http/httpClient';

export const httpVoteRepository: VoteRepository = {
  async getByGroupId(groupId: string) {
    const { data } = await httpClient.get<GroupVoteDTO[]>(`/groups/${groupId}/votes`);
    return data.map(GroupVoteMapper.toDomain);
  },
};
