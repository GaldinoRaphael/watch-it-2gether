import type { Group } from '@watch-it/domain';
import type { GroupDTO } from '../dto/GroupDTO';

export const GroupMapper = {
  toDomain(dto: GroupDTO): Group {
    return {
      id: dto.id,
      name: dto.name,
      ownerId: dto.ownerId,
      members: [],
      memberCount: dto.memberCount ?? 0,
      movieCount: 0,
      createdAt: new Date(dto.createdAt),
    };
  },
};
