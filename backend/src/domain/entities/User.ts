import { UserId } from "../value-objects/UserId";

export class User {
    constructor(
        readonly id: UserId,
        readonly name: string,
        readonly email: string,
        readonly createdAt?: string,
        readonly passwordHash?: string
    ) {}

    static create(name: string, email: string, passwordHash: string): User {
      return new User(UserId.generate(), name, email, new Date().toISOString(), passwordHash);
    }

    getId(): string {
      return this.id.getValue();
    }
}
