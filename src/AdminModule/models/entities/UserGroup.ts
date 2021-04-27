import { BaseEntity } from "../../../AppModule/models";

export interface UserGroup extends BaseEntity {
    client: string;
    name: string;
    isGenerated: boolean;
}

export class UserGroupEntity {
    client: string;

    name: string;

    isGenerated: boolean;

    constructor() {
        this.client = "";
        this.name = "";
        this.isGenerated = false;
    }
}
