import { UserMapper } from "../../infrastructure/http/mappers/user-mapper";
import { IPasswordHasher } from "../../ports/cryptography/password-hasher";
import { UserRepository } from "../../ports/repositories/interfaces/user-repository";

interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase {
    constructor(
        private userRepository: UserRepository,
        private passwordHasher: IPasswordHasher
    ) {}

    async execute({ name, email, password }: RegisterInput) {
        const passwordHash = await this.passwordHasher.hash(password);
        const userDTO = await this.userRepository.create(name, email, passwordHash);
        return UserMapper.dtoToResponseDTO(userDTO);
    }
}