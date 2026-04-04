import { Id } from "./id";

export class GroupMemberId {
  constructor(private readonly id: Id) {}

  static create(value: string): GroupMemberId {
    return new GroupMemberId(Id.create(value));
  }

  static generate(): GroupMemberId {
    return new GroupMemberId(Id.generate());
  }

  getValue(): string {
    return this.id.getValue();
  }

  equals(other: GroupMemberId): boolean {
    return this.id.equals(other.id);
  }
}
