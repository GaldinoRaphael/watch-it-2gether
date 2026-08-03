import { GroupMemberRepository } from "../../infrastructure/repositories/group-member-repository";
import { GroupInviteRepository } from "../../ports/repositories/group-invite-repository";
import { GroupRepository } from "../../ports/repositories/group-repository";

export class AcceptGroupInviteUseCase {
  constructor(
    private readonly groupInviteRepository: GroupInviteRepository,
    private readonly groupRepository: GroupRepository,
    private readonly groupMemberRepository: GroupMemberRepository,
  ) {}

  async execute(token: string, userId: string) {
    const invite = await this.groupInviteRepository.findByToken(token);

    if (!invite) {
      throw new Error("Invite not found");
    }

    const group = await this.groupRepository.findByID(invite.groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    const isAlreadyMember = await this.groupMemberRepository.findByGroupAndUser(group.id, userId);

    if (isAlreadyMember) {
      throw new Error("User is already a member of this group");
    }

    const newMember = await this.groupMemberRepository.addMemberToGroup(group.id, userId);

    return {
        groupId: group.id,
    }
  }
}