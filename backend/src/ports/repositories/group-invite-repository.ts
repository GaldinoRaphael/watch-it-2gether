import type { GroupInvite } from "../../infrastructure/database/prisma/generated";

export interface GroupInviteRepository {
  create(groupId: string, invitedById: string): Promise<GroupInvite>;

  findByToken(token: string): Promise<GroupInvite | null>;

  findByGroupId(groupId: string): Promise<GroupInvite | null>;

  deleteByGroupId(groupId: string): Promise<void>;
}
