import axios from "axios";
import { MovieSummaryDTO } from "../../application/dto/MovieSummaryDTO";
import { MovieGateway } from "../../domain/repositories/MovieGateway";

const instance = axios.create({
    baseURL: 'http://api.imdbapi.dev/',
});

export class IMDBApiClient implements MovieGateway {

    async search(query: string): Promise<MovieSummaryDTO[]> {

        try {
            const response = await instance.get('/search/titles', {
                params: {
                    query: query
                }
            })

            console.log('search', response.data);

            const moviesSummary: MovieSummaryDTO[] = response.data.titles.map((item: any) => {
                return new MovieSummaryDTO(
                    item.id,
                    item.primaryTitle,
                    item.startYear,
                    item.primaryImage.url
                );
            });
            console.log('moviesSummary', moviesSummary);
            return moviesSummary;
        } catch (error) {
            throw new Error("Error fetching data from IMDB API");
        }
    }
}
