import { GroupDTO } from "../../../application/dto/GroupDTO";
import { Repository } from "./repository";

export interface GroupRepository extends Repository<GroupDTO> {}