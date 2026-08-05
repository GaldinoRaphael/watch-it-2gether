import type { User } from '@watch-it/domain';
import type { AuthDTO } from '../dto/AuthDTO';

export const AuthMapper = {
  toDomain(dto: AuthDTO): { token: string; user: User } {
    return {
      token: dto.token,
      user: {
        id: dto.user.id,
        name: dto.user.name,
        email: dto.user.email,
      },
    };
  },
};
