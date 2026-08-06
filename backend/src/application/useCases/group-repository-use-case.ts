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

  async getById(id: string): Promise<Group> {
    const group = await this.groupRepository.findByID(id);

    if (!group) {
      throw new Error("Group not found");
    }

    return group;
  }

  async getAll(): Promise<Group[]> {
    return this.groupRepository.getAll();
  }

  async getAllByUserId(userId: string): Promise<Group[]> {
    return this.groupRepository.findAllByUserId(userId);
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

  async update(id: string, input: UpdateGroupInput): Promise<Group> {
    const currentGroup = await this.getById(id);

    return this.groupRepository.update(id, {
      ...currentGroup,
      name: input.name ?? currentGroup.name,
      ownerId: input.ownerId ?? currentGroup.ownerId,
      createdAt: input.createdAt ? new Date(input.createdAt) : currentGroup.createdAt,
    });
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.groupRepository.delete(id);
  }
}
