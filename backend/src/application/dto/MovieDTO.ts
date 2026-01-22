export class MovieDTO {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly year: string,
    public readonly rating?: number,
  ) {}
}
