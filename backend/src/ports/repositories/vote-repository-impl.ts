import { Commentary } from "../../domain/entities/Commentary";
import { Vote } from "../../domain/entities/Vote";
import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { VoteRepository } from "./vote-repository";

export class VoteRepositoryImpl implements VoteRepository {

    constructor(readonly repositoryClient: PrismaService) {}

    async saveComplete(newVote: Vote, newCommentary: Commentary): Promise<unknown> {
        return await this.repositoryClient.client.vote.create({data: {
            id: newVote.getId(),
            group: { connect: { id: newVote.getGroupId() } },
            user: { connect: { id: newVote.getUserId() } },
            movie: { connect: { id: newVote.getMovieId() } },
            rating: newVote.rating,
            createdAt: newVote.createdAt,
            commentary: {
                create: {
                    id: newCommentary.getId(),
                    userId: newCommentary.userId.getValue(),
                    content: newCommentary.content,
                    createdAt: newCommentary.createdAt
                }
            }
        }});  
    }
}