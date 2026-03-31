export class GroupMember {
    constructor(
        public id: string,
        public groupId: string,
        public userId: string,
        public joinedAt: string,
    ) {}
}