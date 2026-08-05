import type { GroupWatchedMovie, Movie } from "../../infrastructure/database/prisma/generated";
import type { Repository } from "./repository";

export interface GroupWatchedMovieRepository extends Repository<GroupWatchedMovie> {
  upsert(groupId: string, movieId: string): Promise<GroupWatchedMovie>;
  getByGroupIdWithMovie(groupId: string): Promise<(GroupWatchedMovie & { movie: Movie })[]>;
}
