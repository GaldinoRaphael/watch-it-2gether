import axios from "axios";
import { MovieGateway } from "../../domain/repositories/MovieGateway";
import { MovieSummaryDTO } from "../../application/dto/MovieSummaryDTO";

const tmdbToken = process.env.TOKEN_TMDB;
const tmdbBaseUrl = "https://api.themoviedb.org/3";

const instance = axios.create({
  baseURL: tmdbBaseUrl,
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
  poster_path?: string;
  overview?: string;
}


export class TMDBApiClient implements MovieGateway {
  async search(query: string): Promise<MovieSummaryDTO[]> {
    try {
      const response = await instance.get<{ results: TmdbSearchResultItem[] }>("/search/movie", {
        params: { query, language: "pt-BR" },
      });

      return response.data.results.map(
        (item) =>
          new MovieSummaryDTO(
            String(item.id),
            item.original_title,
            item.release_date,
            item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
            item.overview || "",
            tmdbBaseUrl ?? "",
          )
      );
    } catch {
      throw new Error("Error fetching data from TMDB API");
    }
  }

  async getById(externalId: string): Promise<MovieSummaryDTO> {
    try {
      const response = await instance.get<TmdbSearchResultItem>(`/movie/${externalId}`, {
        params: { language: "pt-BR" },
      });
      const item = response.data;
      return new MovieSummaryDTO(
        String(item.id),
        item.original_title,
        item.release_date,
        item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : "",
        item.overview || "",
        tmdbBaseUrl,
      );
    } catch {
      throw new Error("Error fetching data from TMDB API");
    }
  }
}