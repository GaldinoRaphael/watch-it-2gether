import type { WatchedMovie } from '../entities/WatchedMovie';

export interface WatchedMovieRepository {
  getByGroupId(groupId: string): Promise<WatchedMovie[]>;
}
