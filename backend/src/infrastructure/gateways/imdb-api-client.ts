import axios from "axios";
import { MovieSummaryDTO } from "../../application/dto/MovieSummaryDTO";
import type { MovieGateway } from "../../domain/repositories/MovieGateway";
import type { ImdbMovieResponseDTO } from "../../application/dto/response/ImdbMovieResponseDTO";

interface ImdbSearchResultItem {
  id: string;
  primaryTitle: string;
  startYear: string;
  primaryImage?: { url: string };
}

const instance = axios.create({
  baseURL: "https://api.imdbapi.dev/",
});

export class IMDBApiClient implements MovieGateway {
  async search(query: string): Promise<MovieSummaryDTO[]> {
    try {
      const response = await instance.get<{ titles: ImdbSearchResultItem[] }>("/search/titles", {
        params: { query },
      });

      return response.data.titles.map(
        (item) =>
          new MovieSummaryDTO(
            item.id,
            item.primaryTitle,
            item.startYear,
            item.primaryImage?.url ?? "",
          ),
      );
    } catch {
      throw new Error("Error fetching data from IMDB API");
    }
  }

  async getById(externalId: string): Promise<MovieSummaryDTO> {
    try {
      const response = await instance.get<ImdbSearchResultItem>(`/titles/${externalId}`);
      const item = response.data;
      return new MovieSummaryDTO(
        item.id,
        item.primaryTitle,
        item.startYear,
        item.primaryImage?.url ?? "",
      );
    } catch {
      throw new Error("Error fetching data from IMDB API");
    }
  }
}
