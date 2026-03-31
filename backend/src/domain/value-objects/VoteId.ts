import { Id } from "./Id";

export class VoteId {
  constructor(private readonly id: Id) {}

  static create(value: string): VoteId {
    return new VoteId(Id.create(value));
  }

  static generate(): VoteId {
    return new VoteId(Id.generate());
  }

  getValue(): string {
    return this.id.getValue();
  }

  equals(other: VoteId): boolean {
    return this.id.equals(other.id);
  }
}
