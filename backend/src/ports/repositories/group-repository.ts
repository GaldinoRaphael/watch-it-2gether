import { Group } from "../../infrastructure/database/prisma/generated";
import { Repository } from "./repository";

export interface GroupRepository extends Repository<Group> {}