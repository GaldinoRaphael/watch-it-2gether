import { VoteId } from "../value-objects/VoteId";
import { UserId } from "../value-objects/UserId";
import { MovieId } from "../value-objects/MovieId";
import { Commentary } from "./Commentary";
import { CommentaryId } from "../value-objects/CommentaryId";
import { GroupId } from "../value-objects/GroupId";

export class Vote {
    constructor(
        readonly id: VoteId,
        readonly userId: UserId,
        readonly groupId: GroupId,
        readonly movieId: MovieId,
        readonly rating: number,
        readonly commentaryId: CommentaryId,
        readonly createdAt: string = new Date().toISOString(),
    ) {
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
    }

    static create(userId: UserId, groupId: GroupId, movieId: MovieId, rating: number, commentaryId: CommentaryId): Vote {
        return new Vote(VoteId.generate(), userId, groupId, movieId, rating, commentaryId);
    }

    getId(): string {
        return this.id.getValue();
    }

    getUserId(): string {
        return this.userId.getValue();
    }

    getMovieId(): string {
        return this.movieId.getValue();
    }

    getGroupId(): string {
        return this.groupId.getValue();
    }
}