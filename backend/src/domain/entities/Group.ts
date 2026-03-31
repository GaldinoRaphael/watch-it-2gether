import { User } from "./User";

export class Group {
    constructor(
        public id: string,
        public name: string,
        public owner: User,
        public createdAt: string,
    ) {}
}