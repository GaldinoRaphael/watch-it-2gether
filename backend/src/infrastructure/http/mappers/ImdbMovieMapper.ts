import { ImdbMovieResponseDTO } from "../../../application/dto/response/ImdbMovieResponseDTO";

export type ExternalMovieProps = {
  provider: string;
  externalId: string;
  title: string;
  year: string;
  poster?: string | undefined;
  plot?: string | undefined;
  imdbRating?: number | undefined;
};

export class ImdbMovieMapper {
  static toDomain(dto: ImdbMovieResponseDTO): ExternalMovieProps {
    return {
      provider: 'IMDBApi',
      externalId: dto.id,
      title: dto?.primaryTitle,
      year: String(dto?.startYear),
      poster: dto?.primaryImage?.url,
      plot: dto?.plot,
      imdbRating: dto.rating?.aggregateRating
    };
  }
}
