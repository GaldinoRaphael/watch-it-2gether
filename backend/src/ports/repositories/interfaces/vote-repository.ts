
import { VoteDTO } from "../../../application/dto/VoteDTO";
import { Commentary } from "../../../domain/entities/commentary-entity";
import { VoteEntity } from "../../../domain/entities/vote-entity";
import { Repository } from "./repository";

export interface VoteRepository extends Repository<VoteDTO> {
    saveComplete(newVote: VoteEntity, newCommentary: Commentary): unknown;
    updateComplete(voteId: string, rating: number, updatedCommentary: Commentary): Promise<VoteDTO>
}