import { AuthMapper } from '@watch-it/application';
import type { AuthDTO } from '@watch-it/application';
import type { AuthRepository } from '@watch-it/domain';
import { httpClient } from '../http/httpClient';

export const httpAuthRepository: AuthRepository = {
  async login(email, password) {
    const { data } = await httpClient.post<AuthDTO>('/user/login', { email, password });
    return AuthMapper.toDomain(data);
  },
  async register(name, email, password) {
    const { data } = await httpClient.post<AuthDTO>('/user/register', { name, email, password });
    return AuthMapper.toDomain(data);
  },
};
