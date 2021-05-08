import { BaseEntity } from "../../../AppModule/models";
import { Package } from "./Package";

export interface Client extends BaseEntity {
    name: string;
    notes: string;
    packages: Package[];
}

export class ClientEntity {
    name: string;

    notes: string;

    packages: Package[];

    constructor() {
        this.name = "";
        this.notes = "";
        this.packages = [];
    }
}
