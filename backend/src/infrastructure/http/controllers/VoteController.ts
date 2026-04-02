import { VoteUseCase } from "../../../application/useCases/VoteUseCase";
import { Request, Response } from "express";

export class VoteController{
    constructor(private voteUseCase: VoteUseCase){}

    async voteMovie(req: Request<{}, {}, { userId: string; groupId: string; externalId: string; rating: number, commentary: string }>, res: Response){
        try {
            const { userId, groupId, externalId, rating, commentary } = req.body;
            const result = await this.voteUseCase.execute({userId, groupId, externalId, rating, commentary});
            return res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error', errorMessage: (error as Error).message });
        }
    }
}