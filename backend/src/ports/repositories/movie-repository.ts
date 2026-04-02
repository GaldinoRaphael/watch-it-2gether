import { MovieDTO } from "../../application/dto/MovieDTO";
import { MovieEntity } from "../../domain/entities/movie-entity";
import { Repository } from "./repository";

export interface MovieRepository extends Repository<MovieDTO> {
    getMovieByExternalId(externalId: string): Promise<MovieDTO | null>;
}

