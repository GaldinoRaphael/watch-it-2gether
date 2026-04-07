import { CommentaryId } from "../value-objects/commentary-id";
import { UserId } from "../value-objects/user-id";
import { VoteId } from "../value-objects/vote-id";
import { assertDefined, assertNonEmptyString, assertValidDateString } from "./validations/entity-validation";

export class Commentary {
    constructor(
        public readonly id: CommentaryId,
        public readonly userId: UserId,
        public readonly voteId: VoteId,
        public readonly content: string,
        public readonly createdAt: string,
    ) {
        assertDefined(id, "Commentary id");
        assertDefined(userId, "Commentary userId");
        assertDefined(voteId, "Commentary voteId");
        assertNonEmptyString(content, "Commentary content");
        assertValidDateString(createdAt, "Commentary createdAt");
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

