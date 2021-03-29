import { BaseEntity } from "./BaseEntity";

export interface User extends BaseEntity {
    email: string;
    firstName: string;
    lastName: string;
    locale: string;
    client: string;
    roles: string[];
    status: string;
}
