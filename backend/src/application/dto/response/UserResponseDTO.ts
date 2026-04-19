export class UserResponseDTO {
    constructor(
        readonly user: User,
        readonly token: string,
    ){}
}

class User{
    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly createdAt: string = new Date().toISOString()
    ){}
}