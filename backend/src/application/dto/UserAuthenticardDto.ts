import { UserDTO } from "./UserDTO";

export class UserAuthentictedDTO {
    constructor(
        public readonly token: string,
        public readonly user: UserDTO,
    ) {}
}