import { Id } from "./Id";

export class UserId {
  constructor(private readonly id: Id) {}

  static create(value: string): UserId {
    return new UserId(Id.create(value));
  }

  static generate(): UserId {
    return new UserId(Id.generate());
  }

  getValue(): string {
    return this.id.getValue();
  }

  equals(other: UserId): boolean {
    return this.id.equals(other.id);
  }
}
