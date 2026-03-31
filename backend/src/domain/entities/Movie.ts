import { MovieId } from "../value-objects/MovieId";
import { ExternalMovieProps } from "../../infrastructure/http/mappers/ImdbMovieMapper";

export class Movie {
    constructor(
        readonly id: MovieId,
        readonly externalId: string,
        readonly title: string,
        readonly year: string,
        readonly posterUrl?: string,
        readonly createdAt: string = new Date().toISOString(),
        readonly provider = 'api.imdbapi.dev/'
    ) { }

    static create(
        externalId: string,
        title: string,
        year: string,
        posterUrl?: string,
    ): Movie {
        return new Movie(
            MovieId.generate(),
            externalId,
            title,
            year,
            posterUrl,
            new Date().toISOString(),
        );
    }

    getId(): string {
        return this.id.getValue();
    }

    getCreatedAt(): string {
        return this.createdAt;
    }
}
