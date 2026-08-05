export class GroupWatchedMovieDTO {
  constructor(
    readonly id: string,
    readonly groupId: string,
    readonly movieId: string,
    readonly includedAt: string,
    readonly title: string,
    readonly year: string,
    readonly externalId: string,
    readonly posterUrl: string | null,
    readonly provider: string | null,
  ) {}
}
