import { VoteDTO } from "../../application/dto/VoteDTO";
import { Commentary } from "../../domain/entities/Commentary";
import { VoteEntity } from "../../domain/entities/vote-entity";
import { GroupId } from "../../domain/value-objects/GroupId";
import { MovieId } from "../../domain/value-objects/MovieId";
import { Repository } from "./repository";

export interface VoteRepository extends Repository<VoteDTO> {
    saveComplete(newVote: VoteEntity, newCommentary: Commentary): unknown;
}