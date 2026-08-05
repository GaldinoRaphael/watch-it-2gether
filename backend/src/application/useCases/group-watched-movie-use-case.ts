import type { GroupWatchedMovieRepository } from "../../ports/repositories/group-watched-movie-repository";
import type { GroupWatchedMovieDTO } from "../dto/GroupWatchedMovieDTO";
import { GroupWatchedMovieMapper } from "../../infrastructure/http/mappers/group-watched-movie-mapper";

export class GroupWatchedMovieUseCase {
  constructor(private readonly groupWatchedMovieRepository: GroupWatchedMovieRepository) {}

  async getByGroupId(groupId: string): Promise<GroupWatchedMovieDTO[]> {
    const records = await this.groupWatchedMovieRepository.getByGroupIdWithMovie(groupId);
    return records.map(GroupWatchedMovieMapper.modelToDto);
  }
}
