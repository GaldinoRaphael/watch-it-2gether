import { Commentary } from "../../domain/entities/commentary-entity";
import { VoteEntity } from "../../domain/entities/vote-entity";
import { Vote } from "../../infrastructure/database/prisma/generated";
import { Repository } from "./repository";

export interface VoteRepository extends Repository<Vote> {
    saveComplete(newVote: VoteEntity, newCommentary: Commentary): Promise<Vote>;
    updateComplete(voteId: string, rating: number, updatedCommentary: Commentary): Promise<Vote>
}