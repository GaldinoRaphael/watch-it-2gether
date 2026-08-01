import { Id } from "./Id";

export class CommentaryId {
  constructor(private readonly id: Id) {}

  static create(value: string): CommentaryId {
    return new CommentaryId(Id.create(value));
  }

  static generate(): CommentaryId {
    return new CommentaryId(Id.generate());
  }

  getValue(): string {
    return this.id.getValue();
  }

  equals(other: CommentaryId): boolean {
    return this.id.equals(other.id);
  }
}
