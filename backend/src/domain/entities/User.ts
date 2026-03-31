export class User {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly email: string,
        readonly createdAt?: string
    ) { 
        id = id || crypto.randomUUID();
    }    
}