import { MovieSummaryDTO } from "../../application/dto/MovieSummaryDTO";

export interface MovieGateway {
    search(query: string): Promise<MovieSummaryDTO[]>;
}
