import { VoteUseCase } from "../../../application/useCases/VoteUseCase";
import { Request, Response } from "express";

export class VoteController{
    constructor(private voteUseCase: VoteUseCase){}

    async voteMovie(req: Request<{}, {}, { userId: string; externalId: string; rating: number }>, res: Response){
        try {
            const { userId, externalId, rating } = req.body;
            const result = await this.voteUseCase.execute({userId, externalId, rating});
            return res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error', errorMessage: (error as Error).message });
        }
    }
}