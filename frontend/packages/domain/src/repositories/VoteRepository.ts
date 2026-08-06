import type { Vote } from '../entities/Vote';

export interface VoteRepository {
  getByGroupId(groupId: string): Promise<Vote[]>;
}
