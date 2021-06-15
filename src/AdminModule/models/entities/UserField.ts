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
    [key: string]: string;
}
export interface FieldOptions {
    choice: ChoiceOptions;
}
export interface ChoiceOptions {
    [key: string]: string;
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

    options?: FieldOptions;

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
        this.options = { choice: { "": "" } };
    }
}
