export class MovieSummaryDTO {
    constructor(
        public readonly id: string,
        public readonly title: string,
        public readonly year: string,
        public readonly posterUrl: string
    ) {}
}
