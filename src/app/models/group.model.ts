import { List } from "./list.model";

export class Group {
    chatName!: string;
    isGroupChat!: string;
    users!: string[];
    latestMessages!: List[];
    groupAdmin!: string;
}
