import { Commentary } from "../../domain/entities/Commentary";
import { Vote } from "../../domain/entities/Vote";
import { GroupId } from "../../domain/value-objects/GroupId";
import { MovieId } from "../../domain/value-objects/MovieId";
import { VoteRepository } from "./VoteRepository";
import prisma from '../../infrastructure/database/prisma/client/prisma.service';

export class VoteRepositoryImpl implements VoteRepository {
    async saveComplete(newVote: Vote, newCommentary: Commentary): Promise<unknown> {
        return await prisma.vote.create({data: {
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