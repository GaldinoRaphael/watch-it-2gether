import crypto from 'crypto';

export class VoteId {
  private constructor(private readonly value: string) {}

  static create(value: string): VoteId {
    if (!value || value.trim() === '') {
      throw new Error('VoteId cannot be empty');
    }
    return new VoteId(value);
  }

  static generate(): VoteId {
    return new VoteId(crypto.randomUUID());
  }

  get valueAsString(): string {
    return this.value;
  }

  equals(other: VoteId): boolean {
    return this.value === other.value;
  }
}
