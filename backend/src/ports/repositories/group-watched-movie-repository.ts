import type { GroupWatchedMovie, Movie } from "../../infrastructure/database/prisma/generated";
import type { Repository } from "./repository";

export type GroupWatchedMovieWithMovieAndAverage = GroupWatchedMovie & {
  movie: Movie;
  voteAverage: number | null;
};

export interface GroupWatchedMovieRepository extends Repository<GroupWatchedMovie> {
  upsert(groupId: string, movieId: string): Promise<GroupWatchedMovie>;
  getByGroupIdWithMovie(groupId: string): Promise<GroupWatchedMovieWithMovieAndAverage[]>;
}
