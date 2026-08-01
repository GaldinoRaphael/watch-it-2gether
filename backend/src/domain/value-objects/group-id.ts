import { Id } from "./Id";

export class GroupId {
  constructor(private readonly id: Id) {}

  static create(value: string): GroupId {
    return new GroupId(Id.create(value));
  }

  static generate(): GroupId {
    return new GroupId(Id.generate());
  }

  getValue(): string {
    return this.id.getValue();
  }

  equals(other: GroupId): boolean {
    return this.id.equals(other.id);
  }
}
