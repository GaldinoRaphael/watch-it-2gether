import { GroupId } from "../value-objects/group-id";
import { assertDefined, assertNonEmptyString, assertValidDateString } from "./validations/entity-validation";
import { User } from "./user";

export class Group {
    constructor(
        public readonly id: GroupId,
        public readonly name: string,
        public readonly owner: User,
        public readonly createdAt: string,
    ) {
        assertDefined(id, "Group id");
        assertNonEmptyString(name, "Group name");
        assertDefined(owner, "Group owner");
        assertValidDateString(createdAt, "Group createdAt");
    }

    static create(name: string, owner: User): Group {
        const id = GroupId.generate();
        return new Group(id, name, owner, new Date().toISOString());
    }

    getId(): string {
        return this.id.getValue();
    }
}
