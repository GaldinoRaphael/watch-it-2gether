import { GroupWatchedMovieDTO } from "../../../application/dto/GroupWatchedMovieDTO";
import type { GroupWatchedMovie, Movie } from "../../database/prisma/generated";

export class GroupWatchedMovieMapper {
  static modelToDto(record: GroupWatchedMovie & { movie: Movie }): GroupWatchedMovieDTO {
    return new GroupWatchedMovieDTO(
      record.id,
      record.groupId,
      record.movieId,
      record.includedAt.toISOString(),
      record.movie.title,
      record.movie.year,
      record.movie.externalId,
      record.movie.posterUrl,
      record.movie.provider,
    );
  }
}
