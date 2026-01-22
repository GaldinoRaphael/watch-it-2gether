import { MovieId } from "../value-objects/MovieId";
import { ExternalMovieProps } from "../../infrastructure/http/mappers/ImdbMovieMapper";
import { randomUUID } from "node:crypto";

export class Movie {
    constructor(
        readonly id: MovieId,
        readonly externalId: string,
        readonly title: string,
        readonly year: string,
        readonly posterUrl?: string,
        readonly createdAt?: string,
        readonly provider = 'api.imdbapi.dev/'
    ) { }

    static createdFromExternalData(props: ExternalMovieProps) {
        return new Movie(
            MovieId.generate(),
            props.externalId,
            props.title,
            props.year,
            props.poster,
            new Date().toISOString()
        );
    }
}
