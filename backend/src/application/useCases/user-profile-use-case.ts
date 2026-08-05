import type { UserRepository } from "../../ports/repositories/user-repository";

export class UserProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async getProfile(userId: string): Promise<{ id: string; name: string; email: string; createdAt: Date }> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  }
}
