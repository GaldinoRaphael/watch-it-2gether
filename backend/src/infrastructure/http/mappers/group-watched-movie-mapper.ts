import { GroupWatchedMovieDTO } from "../../../application/dto/GroupWatchedMovieDTO";
import type { GroupWatchedMovieWithMovieAndAverage } from "../../../ports/repositories/group-watched-movie-repository";

export class GroupWatchedMovieMapper {
  static modelToDto(record: GroupWatchedMovieWithMovieAndAverage): GroupWatchedMovieDTO {
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
      record.voteAverage,
    );
  }
}
