import { GroupId } from "../value-objects/GroupId";
import { User } from "./User";

export class Group {
    constructor(
        public readonly id: GroupId,
        public readonly name: string,
        public readonly owner: User,
        public readonly createdAt: string,
    ) {}

    static create(name: string, owner: User): Group {
        const id = GroupId.generate();
        return new Group(id, name, owner, new Date().toISOString());
    }

    getId(): string {
        return this.id.getValue();
    }
}
