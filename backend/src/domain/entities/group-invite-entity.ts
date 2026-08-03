import { GroupId } from "../value-objects/group-id";

export class GroupInvite{
    constructor(
        private readonly groupId: GroupId,
        private readonly invitedById: string,
        private readonly expiresAt: Date,
        private readonly token: string,
    ){}
}