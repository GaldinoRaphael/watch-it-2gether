export interface Movie {
  id: string;
  imdbId: string;
  title: string;
  year: number;
  poster: string;
  synopsis: string;
  genres: string[];
  imdbRating: number;
  voteCount: number;
}
