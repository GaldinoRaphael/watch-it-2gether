import { User } from "../../infrastructure/database/prisma/generated";

export interface UserRepository {
    create(name: string, email: string, passwordHash: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
}