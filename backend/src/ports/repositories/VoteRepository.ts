import { Commentary } from "../../domain/entities/Commentary";
import { Vote } from "../../domain/entities/Vote";
import { GroupId } from "../../domain/value-objects/GroupId";
import { MovieId } from "../../domain/value-objects/MovieId";

export interface VoteRepository {
    saveComplete(newVote: Vote, newCommentary: Commentary): unknown;
}