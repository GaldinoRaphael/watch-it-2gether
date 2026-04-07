import { MovieId } from "../value-objects/movie-id";
import { assertDefined, assertNonEmptyString, assertValidDateString } from "./validations/entity-validation";

export class MovieEntity {
    constructor(
        readonly id: MovieId,
        readonly externalId: string,
        readonly title: string,
        readonly year: string,
        readonly posterUrl?: string,
        readonly createdAt: string = new Date().toISOString(),
        readonly provider = 'api.imdbapi.dev/'
    ) {
        assertDefined(id, "Movie id");
        assertNonEmptyString(externalId, "Movie externalId");
        assertNonEmptyString(title, "Movie title");
        assertNonEmptyString(year, "Movie year");
        assertValidDateString(createdAt, "Movie createdAt");
        assertNonEmptyString(provider, "Movie provider");
    }

    static create(
        externalId: string,
        title: string,
        year: string,
        posterUrl?: string,
    ): MovieEntity {
        return new MovieEntity(
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
