import { MovieId } from "domain/value-objects/MovieId";

class Movie {
    constructor(
        readonly id: MovieId,
        readonly externalId: string,
        readonly title: string, 
        readonly year: string) { }
}
