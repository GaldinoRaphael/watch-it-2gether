import type { Group } from "../../infrastructure/database/prisma/generated";
import type { Repository } from "./repository";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface GroupRepository extends Repository<Group> {}