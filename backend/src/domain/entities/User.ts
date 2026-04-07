import { UserId } from "../value-objects/user-id";
import { assertDefined, assertEmailFormat, assertNonEmptyString, assertValidDateString } from "./validations/entity-validation";

export class User {
    constructor(
        readonly id: UserId,
        readonly name: string,
        readonly email: string,
    readonly createdAt: string = new Date().toISOString(),
        readonly passwordHash?: string
  ) {
    assertDefined(id, "User id");
    assertNonEmptyString(name, "User name");
    assertEmailFormat(email, "User email");
    assertValidDateString(createdAt, "User createdAt");

    if (passwordHash !== undefined) {
      assertNonEmptyString(passwordHash, "User passwordHash");
    }
  }

    static create(name: string, email: string, passwordHash: string): User {
      return new User(UserId.generate(), name, email, new Date().toISOString(), passwordHash);
    }

    getId(): string {
      return this.id.getValue();
    }
}
