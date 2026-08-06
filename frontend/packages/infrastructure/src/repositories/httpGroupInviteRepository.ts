import type {
  AcceptGroupInviteResult,
  GroupInviteLink,
  GroupInvitePreview,
  GroupInviteRepository,
} from '@watch-it/domain';
import { httpClient } from '../http/httpClient';

export const httpGroupInviteRepository: GroupInviteRepository = {
  async create(groupId: string) {
    const { data } = await httpClient.post<GroupInviteLink>(`/groups/invite/${groupId}`);
    return data;
  },

  async get(token: string) {
    const { data } = await httpClient.get<GroupInvitePreview>(`/groups/invite/${token}`);
    return data;
  },

  async accept(token: string) {
    const { data } = await httpClient.post<AcceptGroupInviteResult>(`/groups/invite/${token}/accept`);
    return data;
  },
};
