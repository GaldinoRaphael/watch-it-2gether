import { UserDTO } from "../../../application/dto/UserDTO";

export interface UserRepository {
    create(name: string, email: string, passwordHash: string): Promise<UserDTO>;
}