import { CommentaryId } from "../../domain/value-objects/commentary-id";
import { VoteId } from "../../domain/value-objects/vote-id";
import type { VoteRepository } from "../../ports/repositories/vote-repository";
import { VoteDTO } from "../dto/VoteDTO";
import { VoteMapper } from "../../infrastructure/http/mappers/vote-mapper";
import type { Vote } from "../../infrastructure/database/prisma/generated";
import type { Commentary } from "../../infrastructure/database/prisma/generated";

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
    const vote = await this.voteRepository.findByID(id);

    if (!vote) {
      throw new Error("Vote not found");
    }

    return VoteMapper.modelToDto(vote as Vote & { commentary: Commentary[] });
  }

  async getAll(): Promise<VoteDTO[]> {
    const votes = await this.voteRepository.getAll();
    return votes.map((v) => VoteMapper.modelToDto(v as Vote & { commentary: Commentary[] }));
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

    const saved = await this.voteRepository.save(VoteMapper.dtoToModel(vote));
    return VoteMapper.modelToDto(saved as Vote & { commentary: Commentary[] });
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

    const updated = await this.voteRepository.update(id, VoteMapper.dtoToModel(vote));
    return VoteMapper.modelToDto(updated as Vote & { commentary: Commentary[] });
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.voteRepository.delete(id);
  }

  async getByGroupId(groupId: string): Promise<VoteDTO[]> {
    const votes = await this.voteRepository.getByGroupId(groupId);
    return votes.map((v) => VoteMapper.modelToDto(v as Vote & { commentary: Commentary[] }));
  }
}
