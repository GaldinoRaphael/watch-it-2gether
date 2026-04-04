import { VoteId } from "../value-objects/vote-id";
import { UserId } from "../value-objects/user-id";
import { MovieId } from "../value-objects/movie-id";
import { CommentaryId } from "../value-objects/commentary-id";
import { GroupId } from "../value-objects/group-id";
import { assertDefined, assertValidDateString } from "./entity-validation";

export class VoteEntity {
    constructor(
        readonly id: VoteId,
        readonly userId: UserId,
        readonly groupId: GroupId,
        readonly movieId: MovieId,
        readonly rating: number,
        readonly commentaryId: CommentaryId,
        readonly createdAt: string = new Date().toISOString(),
    ) {
        assertDefined(id, "Vote id");
        assertDefined(userId, "Vote userId");
        assertDefined(groupId, "Vote groupId");
        assertDefined(movieId, "Vote movieId");
        assertDefined(commentaryId, "Vote commentaryId");

        if (!Number.isFinite(rating)) {
            throw new Error("Rating must be a valid number");
        }

        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }

        if (!Number.isInteger(rating * 2)) {
            throw new Error("Rating must use 0.5 increments");
        }

        assertValidDateString(createdAt, "Vote createdAt");
    }

    static create(userId: UserId, groupId: GroupId, movieId: MovieId, rating: number, commentaryId: CommentaryId): VoteEntity {
        return new VoteEntity(VoteId.generate(), userId, groupId, movieId, rating, commentaryId);
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