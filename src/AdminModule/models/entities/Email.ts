import { BaseEntity } from "../../../AppModule/models";

export interface Email extends BaseEntity {
    name: string;
    subject: string;
    etKey: string;
    content: string;
    container: string;
}

export class EmailEntity {
    name: string;

    subject: string;

    etKey: string;

    content: string;

    container: string;

    constructor() {
        this.name = "";
        this.subject = "";
        this.etKey = "";
        this.content = "";
        this.container = "";
    }
}
