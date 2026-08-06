import { UserProfileMapper } from '@watch-it/application';
import type { UserProfileDTO } from '@watch-it/application';
import type { UserRepository } from '@watch-it/domain';
import { httpClient } from '../http/httpClient';

interface VoteDTO {
  id: string;
  userId: string;
  rating: number;
}

export const httpUserRepository: UserRepository = {
  async getProfile() {
    const { data } = await httpClient.get<UserProfileDTO>('/user/me');
    return UserProfileMapper.toDomain(data);
  },

  async getTotalRatings(userId: string) {
    const { data } = await httpClient.get<VoteDTO[]>('/votes');
    return data.filter((v) => v.userId === userId).length;
  },

  async getUserById(id: string) {
    const { data } = await httpClient.get<{ id: string; name: string }>(`/user/${id}`);
    return data;
  },
};
