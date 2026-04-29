import { Movie } from "../../infrastructure/database/prisma/generated";
import { Repository } from "./repository";

export interface MovieRepository extends Repository<Movie> {
    getMovieByExternalId(externalId: string): Promise<Movie | null>;
}

