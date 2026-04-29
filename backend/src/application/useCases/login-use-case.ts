import { Bcrypter } from "../../infrastructure/criptography/bcrypter";
import  jwt  from "jsonwebtoken";
import { UserRepository } from "../../ports/repositories/user-repository";

interface Input {
    email: string;
    password: string;
}

export class LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordHasher: Bcrypter) {}

    async execute({ email, password }: Input){

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error("Credenciais inválidas");
        }

        const isPasswordValid = await this.passwordHasher.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas");
        }

        const token = jwt.sign({ userId: user.id, email: user.email }
            , process.env.JWT_SECRET || "secret_key", {expiresIn: "7d"});

        return { token, user: { id: user.id, name: user.name, email: user.email } };
    }
}