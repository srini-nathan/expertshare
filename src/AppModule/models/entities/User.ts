import { BaseEntity } from "./BaseEntity";
import { SimpleObject } from "../SimpleObject";

export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    locale: string;
    jobTitle: string;
    company: string;
    client: string;
    roles: string[];
    status: string;
    userTags?: SimpleObject<string | number>[];
    userFieldValues?: SimpleObject<string | number>[];
}
