import type { GroupMember } from "../../infrastructure/database/prisma/generated";
import type { GroupMemberRepository } from "../../infrastructure/repositories/group-member-repository";

export class GroupMemberUseCase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}

  async getMembers(groupId: string): Promise<GroupMember[]> {
    return this.groupMemberRepository.findByGroupId(groupId);
  }
  
  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const existing = await this.groupMemberRepository.findByGroupAndUser(groupId, userId);

    if (!existing) {
      throw new Error("User is not a member of this group");
    }

    await this.groupMemberRepository.delete(groupId, userId);
  }
}
