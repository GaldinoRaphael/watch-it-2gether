import { ImdbMovieResponseDTO } from "../../application/dto/response/ImdbMovieResponseDTO";
import { MovieSummaryDTO } from "../../application/dto/MovieSummaryDTO";

export interface MovieGateway {
    search(query: string): Promise<MovieSummaryDTO[]>;
    getById(externalId: string): Promise<ImdbMovieResponseDTO>;
}
