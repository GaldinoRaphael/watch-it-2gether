import { CommentaryId } from "../../domain/value-objects/commentary-id";
import { VoteId } from "../../domain/value-objects/vote-id";
import { VoteRepository } from "../../ports/repositories/interfaces/vote-repository";
import { VoteDTO } from "../dto/VoteDTO";

export interface CreateVoteInput {
    id?: string;
    userId: string;
    groupId: string;
    movieId: string;
    rating: number;
    commentaryId?: string;
    commentary?: string;
    createdAt?: string;
}

export interface UpdateVoteInput {
    userId?: string;
    groupId?: string;
    movieId?: string;
    rating?: number;
    commentaryId?: string;
    commentary?: string;
    createdAt?: string;
}

export class VoteRepositoryUseCase {
    constructor(private readonly voteRepository: VoteRepository) {}

    async getById(id: string): Promise<VoteDTO> {
        const vote = await this.voteRepository.getByID(id);

        if (!vote) {
            throw new Error("Vote not found");
        }

        return vote;
    }

    async getAll(): Promise<VoteDTO[]> {
        return this.voteRepository.getAll();
    }

    async create(input: CreateVoteInput): Promise<VoteDTO> {
        const vote = new VoteDTO(
            input.id ?? VoteId.generate().getValue(),
            input.userId,
            input.groupId,
            input.movieId,
            input.rating,
            input.commentaryId ?? CommentaryId.generate().getValue(),
            input.commentary ?? "",
            input.createdAt ?? new Date().toISOString(),
        );

        return this.voteRepository.save(vote);
    }

    async update(id: string, input: UpdateVoteInput): Promise<VoteDTO> {
        const currentVote = await this.getById(id);

        const vote = new VoteDTO(
            id,
            input.userId ?? currentVote.userId,
            input.groupId ?? currentVote.groupId,
            input.movieId ?? currentVote.movieId,
            input.rating ?? currentVote.rating,
            input.commentaryId ?? currentVote.commentaryId,
            input.commentary ?? currentVote.commentary,
            input.createdAt ?? currentVote.createdAt,
        );

        return this.voteRepository.update(id, vote);
    }

    async delete(id: string): Promise<void> {
        await this.getById(id);
        await this.voteRepository.delete(id);
    }
}