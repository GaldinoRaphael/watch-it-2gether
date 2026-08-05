import type { MovieSearchResult } from '../entities/MovieSearchResult';

export interface AddMovieToGroupInput {
  userId: string;
  groupId: string;
  externalId: string;
  movieTitle?: string;
  posterUrl?: string;
  rating: number;
  commentary?: string;
}

export interface MovieRepository {
  search(query: string): Promise<MovieSearchResult[]>;
  addToGroup(input: AddMovieToGroupInput): Promise<void>;
}
