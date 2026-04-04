export class VoteDTO {
    constructor(
        readonly id: string,
        readonly userId: string,
        readonly groupId: string,
        readonly movieId: string,
        readonly rating: number,
        readonly commentaryId: string,
        readonly commentary: string,
        readonly createdAt: string = new Date().toISOString(),
    ) {
    }
}