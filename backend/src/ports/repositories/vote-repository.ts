import type { VoteEntity } from "../../domain/entities/vote-entity";
import type { Vote } from "../../infrastructure/database/prisma/generated";
import type { Repository } from "./repository";

export interface VoteRepository extends Repository<Vote> {
  saveComplete(newVote: VoteEntity, commentary: string): Promise<Vote>;
  updateComplete(voteId: string, rating: number, commentary: string): Promise<Vote>;
  getByGroupId(groupId: string): Promise<Vote[]>;
}
