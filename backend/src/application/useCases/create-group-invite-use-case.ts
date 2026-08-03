import { GroupInviteRepository } from "../../ports/repositories/group-invite-repository";
import { GroupRepository } from "../../ports/repositories/group-repository";

const frontendUrl = process.env.FRONTEND_URL || "";

export class CreateGroupInviteUseCase {
  constructor(
    private readonly groupInviteRepository: GroupInviteRepository,
    private readonly groupRepository: GroupRepository,
  ) {}

  async execute(groupId: string, userId: string) {
    const group = await this.groupRepository.findByID(groupId);

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.ownerId !== userId) {
      throw new Error("Only owner can create invites");
    }
    
    const existingInvite = await this.groupInviteRepository.findByGroupId(groupId);

    if (existingInvite) {
      return {
        token: existingInvite.token,
        url: `${frontendUrl}/invite/${existingInvite.token}`,
      };
    }

    const invite = await this.groupInviteRepository.create(groupId, userId);
    
    return {
      token: invite.token,
      url: `${frontendUrl}/invite/${invite.token}`,
    };
  }
}
