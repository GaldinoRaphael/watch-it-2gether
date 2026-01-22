export interface ImdbMovieResponseDTO {
  id: string;
  type: 'movie' | 'tvSeries' | 'tvMiniSeries' | string;

  primaryTitle: string;
  originalTitle?: string;

  primaryImage?: ImdbImageDTO;

  startYear?: number;
  endYear?: number;

  runtimeSeconds?: number;

  genres?: string[];

  rating?: ImdbRatingDTO;

  plot?: string;

  directors?: ImdbPersonDTO[];
  writers?: ImdbPersonDTO[];
  stars?: ImdbPersonDTO[];

  originCountries?: ImdbCountryDTO[];
  spokenLanguages?: ImdbLanguageDTO[];

  interests?: ImdbInterestDTO[];
}


export interface ImdbImageDTO {
  url: string;
  width: number;
  height: number;
}

export interface ImdbRatingDTO {
  aggregateRating: number;
  voteCount: number;
}

export interface ImdbPersonDTO {
  id: string;
  displayName: string;

  alternativeNames?: string[];

  primaryImage?: ImdbImageDTO;

  primaryProfessions?: string[];
}

export interface ImdbCountryDTO {
  code: string;
  name: string;
}

export interface ImdbLanguageDTO {
  code: string;
  name: string;
}

export interface ImdbInterestDTO {
  id: string;
  name: string;
  isSubgenre?: boolean;
}
