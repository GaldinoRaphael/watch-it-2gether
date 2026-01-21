import { MovieGateway } from "../../domain/repositories/MovieGateway";

export class SearchMoviesUseCase {
    constructor(
        private readonly movieGateway: MovieGateway
    ) {}

    async execute(query: string) {
        return this.movieGateway.search(query);
    }
}
