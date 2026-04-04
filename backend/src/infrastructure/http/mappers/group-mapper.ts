import { GroupDTO } from "../../../application/dto/GroupDTO";
import { Group as PrismaGroup } from "../../database/prisma/generated";

export class groupMapper {
    static toDTO(group: PrismaGroup): GroupDTO {
        return new GroupDTO(
            group.id,
            group.name,
            group.ownerId,
            group.createdAt.toISOString(),
        );
    }
}