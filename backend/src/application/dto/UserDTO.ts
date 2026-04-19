export class UserDTO {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly passwordHash: string,
        readonly createdAt: string = new Date().toISOString(),
    ) {
    }
}