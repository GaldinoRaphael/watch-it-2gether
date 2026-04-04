import { CommentaryId } from "../value-objects/CommentaryId";
import { UserId } from "../value-objects/UserId";
import { VoteId } from "../value-objects/VoteId";

export class Commentary {
    constructor(
        public readonly id: CommentaryId,
        public readonly userId: UserId,
        public readonly voteId: VoteId,
        public readonly content: string,
        public readonly createdAt: string,
    ) {
    }

    static create(userId: UserId, voteId: VoteId, content: string, id = CommentaryId.generate()): Commentary {
        return new Commentary(id, userId, voteId, content, new Date().toISOString());
    }

    static restore(id: string, userId: string, voteId: string, content: string, createdAt: string): Commentary {
        return new Commentary(
            CommentaryId.create(id),
            UserId.create(userId),
            VoteId.create(voteId),
            content,
            createdAt,
        );
    }

    getId(): string {
        return this.id.getValue();
    }

}

