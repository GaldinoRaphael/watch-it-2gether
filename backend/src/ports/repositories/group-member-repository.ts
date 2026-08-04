import type { GroupMember } from "../../infrastructure/database/prisma/generated";

export interface GroupMemberRepository {
  findByGroupId(groupId: string): Promise<GroupMember[]>;
  findByGroupAndUser(groupId: string, userId: string): Promise<GroupMember | null>;
  addMemberToGroup(groupId: string, userId: string): Promise<GroupMember>;
  delete(groupId: string, userId: string): Promise<void>;
  countMembers(groupId: string): Promise<number>;
}
