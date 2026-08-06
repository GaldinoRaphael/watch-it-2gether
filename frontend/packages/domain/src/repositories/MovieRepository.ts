import type { MovieSearchResult } from '../entities/MovieSearchResult';

export interface AddMovieToGroupInput {
  groupId: string;
  externalId: string;
  movieTitle?: string;
  posterUrl?: string;
  provider?: string;
  rating: number;
  commentary?: string;
}

export interface MovieRepository {
  search(query: string): Promise<MovieSearchResult[]>;
  addToGroup(input: AddMovieToGroupInput): Promise<void>;
  getByExternalId(externalId: string): Promise<MovieSearchResult>;
}
