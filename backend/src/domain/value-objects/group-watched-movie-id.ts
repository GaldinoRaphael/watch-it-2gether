import { Id } from "./Id";

export class GroupWatchedMovieId {
  constructor(private readonly id: Id) {}

  static create(value: string): GroupWatchedMovieId {
    return new GroupWatchedMovieId(Id.create(value));
  }

  static generate(): GroupWatchedMovieId {
    return new GroupWatchedMovieId(Id.generate());
  }

  getValue(): string {
    return this.id.getValue();
  }

  equals(other: GroupWatchedMovieId): boolean {
    return this.id.equals(other.id);
  }
}
