export class MovieId{
    private constructor(private readonly value: string) {}

    static create(value: string): MovieId {
        if(!value || value.trim() === '') {
            throw new Error('MovieId cannot be empty');
        }
        return new MovieId(value);
    }

    static generate(): MovieId {
        return new MovieId(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: MovieId): boolean {
        return this.value === other.value;
    }
}
