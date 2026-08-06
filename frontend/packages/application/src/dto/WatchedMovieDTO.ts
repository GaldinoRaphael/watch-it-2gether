export interface WatchedMovieDTO {
  id: string;
  groupId: string;
  movieId: string;
  includedAt: string;
  title: string;
  year: string;
  externalId: string;
  posterUrl: string | null;
  provider: string | null;
  averageRating: number | null;
}
