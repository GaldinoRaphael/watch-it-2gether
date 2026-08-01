import type { Group } from "../../infrastructure/database/prisma/generated";
import type { GroupRepository } from "../../ports/repositories/group-repository";

export interface CreateGroupInput {
    id?: string;
    name: string;
    ownerId: string;
    createdAt?: string;
}

export interface UpdateGroupInput {
    name?: string;
    ownerId?: string;
    createdAt?: string;
}

export class GroupRepositoryUseCase {
    constructor(private readonly groupRepository: GroupRepository) {}

    async getById(id: string): Promise<Group> {
        const group = await this.groupRepository.getByID(id);

        if (!group) {
            throw new Error("Group not found");
        }

        return group;
    }

    async getAll(): Promise<Group[]> {
        return this.groupRepository.getAll();
    }

    async create(input: CreateGroupInput): Promise<Group> {
        return this.groupRepository.save({
            id: crypto.randomUUID(),
            name: input.name,
            ownerId: input.ownerId,
            createdAt: new Date(input.createdAt ?? new Date()),
        });
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