import { VoteDTO } from "../../../application/dto/VoteDTO";
import { Commentary, Vote } from "../../database/prisma/generated";

type VoteWithCommentary = Vote & {
    commentary: Commentary[];
};

export class VoteMapper {
    static modelToDto(vote: VoteWithCommentary): VoteDTO{
        const commentary = vote.commentary[0];

        return new VoteDTO(
            vote.id,
            vote.userId,
            vote.groupId,
            vote.movieId,
            vote.rating,
            commentary?.id ?? "",
            commentary?.content ?? "",
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
            createdAt: new Date(voteDTO.createdAt)
        };
    }

}
