export class UserResponseDTO {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly createdAt: string = new Date().toISOString(),
    ){}
}