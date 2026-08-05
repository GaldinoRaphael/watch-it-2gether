import { VoteDTO } from "../../../application/dto/VoteDTO";
import type { Vote } from "../../database/prisma/generated";

export class VoteMapper {
  static modelToDto(vote: Vote): VoteDTO {
    return new VoteDTO(
      vote.id,
      vote.userId,
      vote.groupId,
      vote.movieId,
      vote.rating,
      vote.commentary,
      vote.createdAt.toISOString(),
    );
  }

  static dtoToModel(voteDTO: VoteDTO): Vote {
    return {
      id: voteDTO.id,
      userId: voteDTO.userId,
      groupId: voteDTO.groupId,
      movieId: voteDTO.movieId,
      rating: voteDTO.rating,
      commentary: voteDTO.commentary,
      createdAt: new Date(voteDTO.createdAt),
    };
  }
}
