import { VoteDTO } from "../../application/dto/VoteDTO";
import { Commentary } from "../../domain/entities/Commentary";
import { VoteEntity } from "../../domain/entities/vote-entity";
import { PrismaService } from "../../infrastructure/database/prisma/client/prisma.service";
import { VoteRepository } from "./vote-repository";
import { VoteMapper } from "../../infrastructure/http/mappers/vote-mapper";

export class VoteRepositoryImpl implements VoteRepository {

    constructor(readonly repositoryClient: PrismaService) {}

    async getByID(id: string): Promise<VoteDTO | null> {
        const vote = await this.repositoryClient.client.vote.findUnique({ where: { id } });
        return vote ? VoteMapper.modelToDto(vote) : null;
    }
    async getAll(): Promise<VoteDTO[]> {
        const votes = await this.repositoryClient.client.vote.findMany();
        return votes.map(VoteMapper.modelToDto);
    }
    async save(entity: VoteDTO): Promise<VoteDTO> {
        const savedVote = await this.repositoryClient.client.vote.create({ data: VoteMapper.dtoToModel(entity) });
        return VoteMapper.modelToDto(savedVote);
    }
    async update(id: string, entity: VoteDTO): Promise<VoteDTO> {
        const updatedVote = await this.repositoryClient.client.vote.update({ where: { id }, data: VoteMapper.dtoToModel(entity) });
        return VoteMapper.modelToDto(updatedVote);
    }
    async delete(id: string): Promise<void> {
        await this.repositoryClient.client.vote.delete({ where: { id } });
    }

    async saveComplete(newVote: VoteEntity, newCommentary: Commentary): Promise<unknown> {
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