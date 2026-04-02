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
}