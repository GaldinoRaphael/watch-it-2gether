import { VoteId } from "../../domain/value-objects/vote-id";
import type { VoteRepository } from "../../ports/repositories/vote-repository";
import { VoteDTO } from "../dto/VoteDTO";
import { VoteMapper } from "../../infrastructure/http/mappers/vote-mapper";
import type { Vote } from "../../infrastructure/database/prisma/generated";

export interface CreateVoteInput {
  id?: string;
  userId: string;
  groupId: string;
  movieId: string;
  rating: number;
  commentary?: string;
  createdAt?: string;
}

export interface UpdateVoteInput {
  userId?: string;
  groupId?: string;
  movieId?: string;
  rating?: number;
  commentary?: string;
  createdAt?: string;
}

export class VoteRepositoryUseCase {
  constructor(private readonly voteRepository: VoteRepository) {}

  async getById(id: string): Promise<VoteDTO> {
    const vote = await this.voteRepository.findByID(id);

    if (!vote) {
      throw new Error("Vote not found");
    }

    return VoteMapper.modelToDto(vote as Vote);
  }

  async getAll(): Promise<VoteDTO[]> {
    const votes = await this.voteRepository.getAll();
    return votes.map((v) => VoteMapper.modelToDto(v as Vote));
  }

  async create(input: CreateVoteInput): Promise<VoteDTO> {
    const vote = new VoteDTO(
      input.id ?? VoteId.generate().getValue(),
      input.userId,
      input.groupId,
      input.movieId,
      input.rating,
      input.commentary ?? "",
      input.createdAt ?? new Date().toISOString(),
    );

    const saved = await this.voteRepository.save(VoteMapper.dtoToModel(vote));
    return VoteMapper.modelToDto(saved as Vote);
  }

  async update(id: string, input: UpdateVoteInput, requesterId: string): Promise<VoteDTO> {
    const currentVote = await this.getById(id);

    if (currentVote.userId !== requesterId) {
      throw new Error("Forbidden: cannot update another user's vote");
    }

    const vote = new VoteDTO(
      id,
      input.userId ?? currentVote.userId,
      input.groupId ?? currentVote.groupId,
      input.movieId ?? currentVote.movieId,
      input.rating ?? currentVote.rating,
      input.commentary ?? currentVote.commentary,
      input.createdAt ?? currentVote.createdAt,
    );

    const updated = await this.voteRepository.update(id, VoteMapper.dtoToModel(vote));
    return VoteMapper.modelToDto(updated as Vote);
  }

  async delete(id: string, requesterId: string): Promise<void> {
    const vote = await this.getById(id);

    if (vote.userId !== requesterId) {
      throw new Error("Forbidden: cannot delete another user's vote");
    }

    await this.voteRepository.delete(id);
  }

  async getByGroupId(groupId: string): Promise<VoteDTO[]> {
    const votes = await this.voteRepository.getByGroupId(groupId);
    return votes.map((v) => VoteMapper.modelToDto(v as Vote));
  }
}
