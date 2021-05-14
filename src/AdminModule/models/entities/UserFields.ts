import { BaseEntity } from "../../../AppModule/models";

export interface UserFields extends BaseEntity {
    name: string;
    fieldKey: string;
    labelKey: string;
    fieldType: string;
    isActive?: boolean;
    isExport?: boolean;
    isImport?: boolean;
    isVcf?: boolean;
    attr?: FieldsAttr;
    options?: FieldOptions;
}

export interface FieldsAttr {
    type: string;
}
export interface FieldOptions {
    choices: { [key: string]: string };
}
export class UserFieldsEntity {
    name: string;

    fieldKey: string;

    labelKey: string;

    fieldType: string;

    isActive: boolean;

    isExport: boolean;

    isImport: boolean;

    isVcf: boolean;

    constructor() {
        this.name = "";
        this.fieldKey = "";
        this.labelKey = "";
        this.fieldType = "";
        this.isActive = false;
        this.isExport = false;
        this.isImport = false;
        this.isVcf = false;
    }
}
