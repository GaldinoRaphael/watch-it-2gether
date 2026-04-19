import { IPasswordHasher } from "../../ports/cryptography/password-hasher";
import bcrypt from 'bcrypt';

export class Bcrypter implements IPasswordHasher {
    hash(password: string): Promise<string> {
       const rounds = 10;
       return bcrypt.hash(password, rounds);
    }

    compare(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}