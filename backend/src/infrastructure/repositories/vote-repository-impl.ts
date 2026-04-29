import { Commentary } from "../../domain/entities/commentary-entity";
import { VoteEntity } from "../../domain/entities/vote-entity";
import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { VoteMapper } from "../../infrastructure/http/mappers/vote-mapper";
import { VoteRepository } from "../../ports/repositories/vote-repository";
import { Vote } from "../database/prisma/generated";

export class VoteRepositoryImpl implements VoteRepository {

    constructor(readonly repositoryClient: PrismaService) {}


    async getByID(id: string): Promise<Vote | null> {
        const vote = await this.repositoryClient.client.vote.findUnique({ where: { id }, include: { commentary: true } });

        if(!vote) {
            return null;
        }
        return vote;
    }

    async getAll(): Promise<Vote[]> {
        const votes = await this.repositoryClient.client.vote.findMany({ include: { commentary: true } });
        return votes;
    }

    async save(entity: Vote): Promise<Vote> {
        const savedVote = await this.repositoryClient.client.vote.create({
            data: entity,
            include: { commentary: true },
        });
        return savedVote;
    }

    async update(id: string, entity: Vote): Promise<Vote> {
        const updatedVote = await this.repositoryClient.client.vote.update({
            where: { id },
            data: entity,
            include: { commentary: true },
        });
        return updatedVote;
    }

    async delete(id: string): Promise<void> {
        await this.repositoryClient.client.$transaction([
            this.repositoryClient.client.commentary.deleteMany({ where: { voteId: id } }),
            this.repositoryClient.client.vote.delete({ where: { id } }),
        ]);
    }

    async saveComplete(newVote: VoteEntity, newCommentary: Commentary): Promise<Vote> {
        const voteSaved = await this.repositoryClient.client.vote.create({data: {
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
        }, include: { commentary: true } });  

        return voteSaved;
    }

    async updateComplete(voteId: string, rating: number, updatedCommentary: Commentary): Promise<Vote> {
        const voteUpdated = await this.repositoryClient.client.vote.update({
            where: { id: voteId },
            data: {
                rating: rating,
                commentary: {
                    update: {
                        where: { id: updatedCommentary.getId() },
                        data: {
                            content: updatedCommentary.content,
                        }
                    }
                }
            },
            include: { commentary: true },
        });

        return voteUpdated;
    }   
}