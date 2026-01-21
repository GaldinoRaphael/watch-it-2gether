import MovieId = require("../value-objects/MovieId");

class Movie {
    constructor(
        readonly id: MovieId.MovieId, 
        readonly title: string, 
        readonly year: string) { }
}
