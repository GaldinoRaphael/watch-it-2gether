import axios from "axios";
import { MovieGateway } from "../../domain/repositories/MovieGateway";
import { MovieSummaryDTO } from "../../application/dto/MovieSummaryDTO";
import { ImdbMovieResponseDTO } from "../../application/dto/response/ImdbMovieResponseDTO";

const tmdbToken = process.env.TOKEN_TMDB;

const instance = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: tmdbToken
    ? {
        Authorization: `Bearer ${tmdbToken}`,
      }
    : undefined,
});

interface TmdbSearchResultItem {
  id: string;
  original_title: string;
  release_date: string;
  poster_path?: string
}


export class TMDBApiClient implements MovieGateway {
  async search(query: string): Promise<MovieSummaryDTO[]> {
    try {
      const response = await instance.get<{ results: TmdbSearchResultItem[] }>("/search/movie", {
        params: { query },
      });

      return response.data.results.map(
        (item) =>
          new MovieSummaryDTO(
            item.id,
            item.original_title,
            item.release_date,
            item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : ""
          )
      );
    } catch {
      throw new Error("Error fetching data from TMDB API");
    }
  }

  async getById(externalId: string): Promise<ImdbMovieResponseDTO> {
    try {
      const response = await instance.get<ImdbMovieResponseDTO>(`/movie/${externalId}`);
      return response.data;
    } catch {
      throw new Error("Error fetching data from TMDB API");
    }
  }
}