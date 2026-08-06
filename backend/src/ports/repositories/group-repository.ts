import type { Group } from "../../infrastructure/database/prisma/generated";
import type { Repository } from "./repository";

export interface GroupRepository extends Repository<Group> {
  findAllByUserId(userId: string): Promise<Group[]>;
}
