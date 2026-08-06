export interface GroupMember {
  id: string;
  userId: string;
  name: string;
  avatarUrl?: string;
  joinedAt: Date;
}

export interface Group {
  id: string;
  name: string;
  ownerId: string;
  members: GroupMember[];
  memberCount: number;
  movieCount: number;
  createdAt: Date;
}
