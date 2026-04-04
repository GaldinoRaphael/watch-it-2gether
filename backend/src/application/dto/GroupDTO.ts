export class GroupDTO {
    constructor(
        readonly id: string,
        readonly name: string,
        readonly ownerId: string,
        readonly createdAt: string = new Date().toISOString(),
    ) {}
}