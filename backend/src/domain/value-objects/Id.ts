import crypto from 'crypto';

export class Id {
    private constructor(private readonly value: string) {}

    static create(value: string): Id {
        if (!value) {
            throw new Error('Id cannot be empty');
        }
        return new Id(value);
    }

    static generate(): Id {
        return new Id(crypto.randomUUID());
    }

    getValue(): string {
        return this.value;
    }

    equals(other: Id): boolean {
        return this.value === other.value;
    }
}

