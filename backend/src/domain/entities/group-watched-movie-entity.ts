import type { GroupId } from "../value-objects/group-id";
import type { MovieId } from "../value-objects/movie-id";
import { GroupWatchedMovieId } from "../value-objects/group-watched-movie-id";
import { assertDefined } from "./validations/entity-validation";

export class GroupWatchedMovieEntity {
  constructor(
    readonly id: GroupWatchedMovieId,
    readonly groupId: GroupId,
    readonly movieId: MovieId,
    readonly includedAt: string = new Date().toISOString(),
  ) {
    assertDefined(id, "GroupWatchedMovie id");
    assertDefined(groupId, "GroupWatchedMovie groupId");
    assertDefined(movieId, "GroupWatchedMovie movieId");
  }

  static create(groupId: GroupId, movieId: MovieId): GroupWatchedMovieEntity {
    return new GroupWatchedMovieEntity(GroupWatchedMovieId.generate(), groupId, movieId);
  }

  getId(): string {
    return this.id.getValue();
  }

  getGroupId(): string {
    return this.groupId.getValue();
  }

  getMovieId(): string {
    return this.movieId.getValue();
  }
}
