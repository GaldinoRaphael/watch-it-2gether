import type { UserProfile } from '@watch-it/domain';
import type { UserProfileDTO } from '../dto/UserProfileDTO';

export const UserProfileMapper = {
  toDomain(dto: UserProfileDTO): UserProfile {
    return {
      id: dto.id,
      name: dto.name,
      email: dto.email,
      createdAt: dto.createdAt ?? new Date().toISOString(),
    };
  },
};
