import type { UserProfile } from '../entities/UserProfile';

export interface UserRepository {
  getProfile(): Promise<UserProfile>;
  getTotalRatings(userId: string): Promise<number>;
}
