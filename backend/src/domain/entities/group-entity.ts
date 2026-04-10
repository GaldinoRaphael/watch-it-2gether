import { GroupId } from "../value-objects/group-id";
import { assertDefined, assertNonEmptyString, assertValidDateString } from "./validations/entity-validation";
import { UserEntity } from "./user-entity";

export class GroupEntity {
    constructor(
        public readonly id: GroupId,
        public readonly name: string,
        public readonly owner: UserEntity,
        public readonly createdAt: string,
    ) {
        assertDefined(id, "Group id");
        assertNonEmptyString(name, "Group name");
        assertDefined(owner, "Group owner");
        assertValidDateString(createdAt, "Group createdAt");
    }

    static create(name: string, owner: UserEntity): GroupEntity {
        const id = GroupId.generate();
        return new GroupEntity(id, name, owner, new Date().toISOString());
    }

    getId(): string {
        return this.id.getValue();
    }
}
