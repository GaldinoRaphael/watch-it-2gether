import { MovieDTO } from "../../application/dto/MovieDTO";
import { Movie } from "../../domain/entities/Movie";

export interface MovieRepository {
    save(movie: Movie): Promise<MovieDTO>;
}

