import { BaseEntity } from "../../../AppModule/models";

export interface Language extends BaseEntity {
    name: string;
    locale: string;
    isActive: boolean;
    isDefault: boolean;
    container: string;
}

export class LanguageEntity {
    name: string;

    locale: string;

    isActive: boolean;

    isDefault: boolean;

    constructor() {
        this.name = "";
        this.locale = "";
        this.isActive = false;
        this.isDefault = false;
    }
}
