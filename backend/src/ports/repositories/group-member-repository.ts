import type { GroupMember } from "../../infrastructure/database/prisma/generated";

export interface GroupMemberRepository {
  findByGroupId(groupId: string): Promise<GroupMember[]>;
  findByGroupAndUser(groupId: string, userId: string): Promise<GroupMember | null>;
  create(groupId: string, userId: string): Promise<GroupMember>;
  delete(groupId: string, userId: string): Promise<void>;
}
