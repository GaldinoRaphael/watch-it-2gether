import { VoteId } from "../value-objects/VoteId";
import { UserId } from "../value-objects/UserId";
import { MovieId } from "../value-objects/MovieId";

export class Vote {
    constructor(
        readonly id: VoteId,
        readonly userId: UserId,
        readonly movieId: MovieId,
        readonly rating: number,
        readonly createdAt: string = new Date().toISOString(),
    ) {
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
    }

    static create(userId: UserId, movieId: MovieId, rating: number): Vote {
        return new Vote(VoteId.generate(), userId, movieId, rating);
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
}