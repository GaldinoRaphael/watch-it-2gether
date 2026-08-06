export interface WatchedMovie {
  id: string;
  groupId: string;
  movieId: string;
  includedAt: Date;
  title: string;
  year: string;
  externalId: string;
  posterUrl: string | null;
  provider: string | null;
  averageRating: number | null;
}
