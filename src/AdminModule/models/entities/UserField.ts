import { BaseEntity } from "../../../AppModule/models";

export interface UserField extends BaseEntity {
    name: string;
    fieldKey: string;
    labelKey: string;
    fieldType: string;
    isActive?: boolean;
    isExport?: boolean;
    isImport?: boolean;
    isVcf?: boolean;
    isRequired?: boolean;
    attr?: FieldsAttr[];
    options?: FieldOptions[];
}

export interface FieldsAttr {
    type: string;
    value: string;
}
export interface FieldOptions {
    key: string;
    value: string;
}
export class UserFieldEntity {
    name: string;

    fieldKey: string;

    labelKey: string;

    fieldType: string;

    isActive: boolean;

    isExport: boolean;

    isImport: boolean;

    isVcf: boolean;

    isRequired: boolean;

    attr?: FieldsAttr[];

    options?: FieldOptions[];

    constructor() {
        this.name = "";
        this.fieldKey = "";
        this.labelKey = "";
        this.fieldType = "";
        this.isActive = false;
        this.isExport = false;
        this.isImport = false;
        this.isVcf = false;
        this.isRequired = false;
        this.attr = [];
        this.options = [];
    }
}
