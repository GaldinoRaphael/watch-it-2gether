import type { Vote } from '@watch-it/domain';
import type { GroupVoteDTO } from '../dto/GroupVoteDTO';

export const GroupVoteMapper = {
  toDomain(dto: GroupVoteDTO): Vote {
    return {
      id: dto.id,
      movieId: dto.movieId,
      userId: dto.userId,
      groupId: dto.groupId,
      rating: dto.rating,
      commentary: dto.commentary,
      createdAt: new Date(dto.createdAt),
    };
  },
};
