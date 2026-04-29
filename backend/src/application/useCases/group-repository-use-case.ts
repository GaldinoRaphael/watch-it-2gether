import { GroupEntity } from "../../domain/entities/group-entity";
import { GroupId } from "../../domain/value-objects/group-id";
import { Group } from "../../infrastructure/database/prisma/generated";
import { GroupRepository } from "../../ports/repositories/group-repository";

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
        const group = new GroupEntity(
            GroupId.generate(),
            input.name,
            input.ownerId,
            input.createdAt ?? new Date().toISOString(),
        );

        return this.groupRepository.save(group);
    }

    async update(id: string, input: UpdateGroupInput): Promise<Group> {
        const currentGroup = await this.getById(id);

        const group = new GroupEntity(
            id,
            input.name ?? currentGroup.name,
            input.ownerId ?? currentGroup.ownerId,
            input.createdAt ?? currentGroup.createdAt,
        );

        return this.groupRepository.update(id, group);
    }

    async delete(id: string): Promise<void> {
        await this.getById(id);
        await this.groupRepository.delete(id);
    }
}