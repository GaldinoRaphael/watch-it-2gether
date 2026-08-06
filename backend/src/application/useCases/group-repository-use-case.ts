import { randomUUID } from "node:crypto";
import type { Group } from "../../infrastructure/database/prisma/generated";
import type { GroupRepository } from "../../ports/repositories/group-repository";
import { GroupMemberRepository } from "../../ports/repositories/group-member-repository";

export interface CreateGroupInput {
  id?: string;
  name: string;
  ownerId?: string;
  createdAt?: string;
}

export interface UpdateGroupInput {
  name?: string;
  ownerId?: string;
  createdAt?: string;
}

export class GroupRepositoryUseCase {
  constructor(private readonly groupRepository: GroupRepository, private readonly groupMemberRepository: GroupMemberRepository) {}

  async getById(id: string): Promise<Group & { memberCount: number }> {
    const group = await this.groupRepository.findByID(id);

    if (!group) {
      throw new Error("Group not found");
    }

    const memberCount = await this.groupMemberRepository.countMembers(id);
    return { ...group, memberCount };
  }

  async getAll(): Promise<Group[]> {
    return this.groupRepository.getAll();
  }

  async getAllByUserId(userId: string): Promise<(Group & { memberCount: number })[]> {
    const groups = await this.groupRepository.findAllByUserId(userId);
    return Promise.all(
      groups.map(async (group) => ({
        ...group,
        memberCount: await this.groupMemberRepository.countMembers(group.id),
      })),
    );
  }

  async create(input: CreateGroupInput): Promise<Group> {
    const group = await this.groupRepository.save({
      id: randomUUID(),
      name: input.name,
      ownerId: input.ownerId!,
      createdAt: new Date(input.createdAt ?? new Date()),
    });

    await this.groupMemberRepository.addMemberToGroup(group.id, group.ownerId);

    return group;
  }

  async update(id: string, input: UpdateGroupInput, requesterId: string): Promise<Group> {
    const currentGroup = await this.getById(id);

    if (currentGroup.ownerId !== requesterId) {
      throw new Error("Forbidden: only the group owner can update this group");
    }

    return this.groupRepository.update(id, {
      ...currentGroup,
      name: input.name ?? currentGroup.name,
      ownerId: input.ownerId ?? currentGroup.ownerId,
      createdAt: input.createdAt ? new Date(input.createdAt) : currentGroup.createdAt,
    });
  }

  async delete(id: string, requesterId: string): Promise<void> {
    const group = await this.getById(id);

    if (group.ownerId !== requesterId) {
      throw new Error("Forbidden: only the group owner can delete this group");
    }

    await this.groupRepository.delete(id);
  }
}
