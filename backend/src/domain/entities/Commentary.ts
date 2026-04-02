import { CommentaryId } from "../value-objects/CommentaryId";
import { MovieId } from "../value-objects/MovieId";
import { UserId } from "../value-objects/UserId";
import { MovieEntity } from "./movie-entity";
import { User } from "./User";

export class Commentary {
    constructor(
        public readonly id: CommentaryId,
        public readonly userId: UserId,
        public readonly movieId: MovieId,
        public readonly content: string,
        public readonly createdAt: string,
    ) {
    }

    static create(userId: UserId, movieId: MovieId, content: string): Commentary {
        const id = CommentaryId.generate();
        return new Commentary(id, userId, movieId, content, new Date().toISOString());
    }

    getId(): string {
        return this.id.getValue();
    }

}