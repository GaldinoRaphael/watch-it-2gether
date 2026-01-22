import { MovieId } from "../value-objects/MovieId";
import { VoteId } from "../value-objects/VoteId";

export class Vote{
    constructor(
        readonly id: VoteId,
        readonly userId: string,
        readonly movieId: MovieId,
        readonly rating: number
        ) { 
            id = id || crypto.randomUUID();

            if(rating < 1 || rating > 5){
                throw new Error("Rating must be between 1 and 5");
            }
        }
}