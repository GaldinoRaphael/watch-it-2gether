import type { Commentary } from "../../domain/entities/commentary-entity";
import type { VoteEntity } from "../../domain/entities/vote-entity";
import type { Vote } from "../../infrastructure/database/prisma/generated";
import type { Repository } from "./repository";

export interface VoteRepository extends Repository<Vote> {
  saveComplete(newVote: VoteEntity, newCommentary: Commentary): Promise<Vote>;
  updateComplete(voteId: string, rating: number, updatedCommentary: Commentary): Promise<Vote>;
  getByGroupId(groupId: string): Promise<Vote[]>;
}
