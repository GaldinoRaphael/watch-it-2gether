export class MovieSummaryDTO {
    constructor(
        readonly id: string,
        readonly title: string,
        readonly year: string,
        readonly posterUrl: string
    ) {}
}
