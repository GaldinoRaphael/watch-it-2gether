export class MovieDTO {
  constructor(
        readonly id: string,
        readonly externalId: string,
        readonly title: string,
        readonly year: string,
        readonly posterUrl?: string,
  ) {}
}
