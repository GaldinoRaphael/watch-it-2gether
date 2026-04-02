import { MovieDTO } from "../../../application/dto/MovieDTO";
import { Movie } from "../../database/prisma/generated";

export class movieMapper {
    static toDTO(movie: Movie): MovieDTO {
        return new MovieDTO(
            movie.id,
            movie.externalId,
            movie.title,
            movie.year,
            movie.posterUrl ?? undefined
        );
    }

    static dtoToModel(movieDTO: MovieDTO): Movie {
        return {
            id: movieDTO.id,
            externalId: movieDTO.externalId,
            title: movieDTO.title,
            year: movieDTO.year,
            posterUrl: movieDTO.posterUrl ?? null,
            createdAt: new Date(movieDTO.createdAt) ?? null,
            provider: 'api.imdbapi.dev/'
        };
    }
}