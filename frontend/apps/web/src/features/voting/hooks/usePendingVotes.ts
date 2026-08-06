import type { Vote, WatchedMovie } from '@watch-it/domain';
import { useMemo } from 'react';

export function usePendingVotes(
  watchedMovies: WatchedMovie[] | undefined,
  groupVotes: Vote[] | undefined,
  userId: string | undefined,
): WatchedMovie[] {
  return useMemo(() => {
    if (!watchedMovies || !groupVotes || !userId) return [];
    const ratedMovieIds = new Set(
      groupVotes.filter((v) => v.userId === userId).map((v) => v.movieId),
    );
    return watchedMovies.filter((m) => !ratedMovieIds.has(m.movieId));
  }, [watchedMovies, groupVotes, userId]);
}
