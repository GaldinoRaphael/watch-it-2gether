import { GroupInviteRepository } from "../../../ports/repositories/group-invite-repository";
import { GroupMemberRepository } from "../../../ports/repositories/group-member-repository";
import { GroupRepository } from "../../../ports/repositories/group-repository";

export class GetGroupInviteUseCase {
    constructor(
        private readonly groupInviteRepository: GroupInviteRepository,
        private readonly groupRepository: GroupRepository,
        private readonly groupMemberRepository: GroupMemberRepository,
    ) {}

    async execute(token: string) {
        const invite = await this.groupInviteRepository.findByToken(token);

        if (!invite) {
            throw new Error("Invite not found");
        }

        const group = await this.groupRepository.findByID(invite.groupId);

        if (!group) {
            throw new Error("Group not found");
        }

        const numberOfMembers = await this.groupMemberRepository.countMembers(group.id);

        return {
            group: {
                id: group.id,
                name: group.name,
                numberOfMembers: numberOfMembers,
            },
        };
    }
}
    