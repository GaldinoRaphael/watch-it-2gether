export class Vote{
    constructor(
        readonly userId: string,
        readonly movieId: string,
        readonly rating: number
        ) { 
            if(rating < 1 || rating > 5){
                throw new Error("Rating must be between 1 and 5");
            }
        }
}