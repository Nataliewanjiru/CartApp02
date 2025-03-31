import { List } from "./list.model";

export class User {
    firstname!: string;
    lastname!:string;
    username!:string;
    email!:string;
    password!:string;
    userpicture!:string;
    createdAt?:string;
    groups!:List[];
}
