import { MovieDTO } from "../../application/dto/MovieDTO";
import { Movie } from "../../domain/entities/Movie";
import { MovieRepository } from "./MovieRepository";

export class MovieRepositoryImpl implements MovieRepository {
    movies: Movie[] = [];

    save(movie: Movie): Promise<MovieDTO> {
        this.movies.push(movie);
        const movieDTO = new MovieDTO(
            (this.movies.length).toString(),
            movie.title,
            movie.year
        );
        return Promise.resolve(movieDTO);
    }
}