import { BaseEntity } from "./BaseEntity";
import { SimpleObject } from "../SimpleObject";

export interface User extends BaseEntity {
    email: string;
    firstName: string;
    id: number;
    lastName: string;
    locale: string;
    jobTitle: string;
    company: string;
    isAllowCommunication: boolean;
    isDisplayAsGuest: boolean;
    isExposeEmail: boolean;
    client: string;
    roles: string[];
    timezone: string;
    status: string;
    userTags?: SimpleObject<string | number>[];
    userFieldValues?: SimpleObject<string | number>[];
    imageName?: string;
}
