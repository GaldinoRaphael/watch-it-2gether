import { GroupMemberId } from "../value-objects/group-member-id";
import { GroupId } from "../value-objects/group-id";
import { UserId } from "../value-objects/user-id";
import { assertDefined, assertValidDateString } from "./entity-validation";

export class GroupMember {
    constructor(
        public readonly id: GroupMemberId,
        public readonly groupId: GroupId,
        public readonly userId: UserId,
        public readonly joinedAt: string,
    ) {
        assertDefined(id, "GroupMember id");
        assertDefined(groupId, "GroupMember groupId");
        assertDefined(userId, "GroupMember userId");
        assertValidDateString(joinedAt, "GroupMember joinedAt");
    }

    static create(groupId: GroupId, userId: UserId): GroupMember {
        return new GroupMember(GroupMemberId.generate(), groupId, userId, new Date().toISOString());
    }

    getId(): string {
        return this.id.getValue();
    }

    getGroupId(): string {
        return this.groupId.getValue();
    }

    getUserId(): string {
        return this.userId.getValue();
    }
}