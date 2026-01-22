import { Vote } from "../../domain/entities/Vote";
import { VoteRepository } from "./VoteRepository";

export class VoteRepositoryImpl implements VoteRepository {
    //TO-DO: Implement with a real database
    votes: Vote[] = [];

    findByUserIdAndExternalId(userId: string, externalId: any): Vote | null {
        return null;
    }

    save(vote: Vote): Promise<void> {
        this.votes.push(vote);
        console.log("Vote saved:", vote);
        return Promise.resolve();
    }
}