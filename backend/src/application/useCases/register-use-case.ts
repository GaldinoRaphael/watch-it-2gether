import type { IPasswordHasher } from "../../ports/cryptography/password-hasher";
import type { UserRepository } from "../../ports/repositories/user-repository";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordHasher: IPasswordHasher,
  ) {}

  async execute({ name, email, password }: RegisterInput) {
    const existing = await this.userRepository.findByEmail(email);

    if (existing) {
      throw new Error("Email already in use");
    }

    const passwordHash = await this.passwordHasher.hash(password);
    return await this.userRepository.create(name, email, passwordHash);
  }
}
