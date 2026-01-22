import { Vote } from "../../domain/entities/Vote";

export interface VoteRepository {
    findByUserIdAndExternalId(userId: string, externalId: any): Vote | null;
    save(vote: Vote): Promise<void>;
}