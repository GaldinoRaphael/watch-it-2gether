import type { GroupMember } from "../../infrastructure/database/prisma/generated";
import type { GroupMemberRepository } from "../../ports/repositories/group-member-repository";

export class GroupMemberUseCase {
  constructor(private readonly groupMemberRepository: GroupMemberRepository) {}

  async getMembers(groupId: string): Promise<GroupMember[]> {
    return this.groupMemberRepository.findByGroupId(groupId);
  }

  async joinGroup(groupId: string, userId: string): Promise<GroupMember> {
    const existing = await this.groupMemberRepository.findByGroupAndUser(groupId, userId);

    if (existing) {
      throw new Error("User is already a member of this group");
    }

    return this.groupMemberRepository.create(groupId, userId);
  }

  async leaveGroup(groupId: string, userId: string): Promise<void> {
    const existing = await this.groupMemberRepository.findByGroupAndUser(groupId, userId);

    if (!existing) {
      throw new Error("User is not a member of this group");
    }

    await this.groupMemberRepository.delete(groupId, userId);
  }
}
