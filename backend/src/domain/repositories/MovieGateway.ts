import type { ImdbMovieResponseDTO } from "../../application/dto/response/ImdbMovieResponseDTO";
import type { MovieSummaryDTO } from "../../application/dto/MovieSummaryDTO";

export interface MovieGateway {
  search(query: string): Promise<MovieSummaryDTO[]>;
  getById(externalId: string): Promise<ImdbMovieResponseDTO>;
}
