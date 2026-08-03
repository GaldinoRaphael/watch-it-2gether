import type { Movie } from "../../infrastructure/database/prisma/generated";
import type { Repository } from "./repository";

export interface MovieRepository extends Repository<Movie> {
  getMovieByExternalId(externalId: string): Promise<Movie | null>;
}
