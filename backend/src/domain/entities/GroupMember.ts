import { GroupMemberId } from "../value-objects/GroupMemberId";
import { GroupId } from "../value-objects/GroupId";
import { UserId } from "../value-objects/UserId";

export class GroupMember {
    constructor(
        public readonly id: GroupMemberId,
        public readonly groupId: GroupId,
        public readonly userId: UserId,
        public readonly joinedAt: string,
    ) {}

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