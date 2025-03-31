import { List } from "./list.model";

export class Group {
    groupName!: string;
    description!: string;
    groupImage!:string;
    members!: List[];
    cartgroupItems!: List[];
    createdAt?:string;
}
