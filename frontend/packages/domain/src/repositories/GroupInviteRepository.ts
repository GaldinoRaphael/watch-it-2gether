export interface GroupInviteLink {
  token: string;
  url: string;
}

export interface GroupInvitePreview {
  group: {
    id: string;
    name: string;
    numberOfMembers: number;
  };
}

export interface AcceptGroupInviteResult {
  groupId: string;
}

export interface GroupInviteRepository {
  create(groupId: string): Promise<GroupInviteLink>;
  get(token: string): Promise<GroupInvitePreview>;
  accept(token: string): Promise<AcceptGroupInviteResult>;
}
