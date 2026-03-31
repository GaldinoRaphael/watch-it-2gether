import { Id } from "./Id";

export class MovieId {
  constructor(private readonly id: Id) {}

  static create(value: string): MovieId {
    return new MovieId(Id.create(value));
  }

  static generate(): MovieId {
    return new MovieId(Id.generate());
  }

  getValue(): string {
    return this.id.getValue();
  }

  equals(other: MovieId): boolean {
    return this.id.equals(other.id);
  }
}

