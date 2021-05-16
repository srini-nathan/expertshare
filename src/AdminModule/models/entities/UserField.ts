import { BaseEntity } from "../../../AppModule/models";
import { Client } from "./Client";
import { CONSTANTS } from "../../../config";

export class UserField extends BaseEntity {
    client: string | Client;

    name: string;

    fieldKey: string;

    labelKey: string;

    fieldType: string;

    isActive?: boolean;

    isExport?: boolean;

    isImport?: boolean;

    isVcf?: boolean;

    isRequired?: boolean;

    attr?: FieldsAttr;

    options?: FieldOptions;

    constructor(
        client: string,
        {
            name = "",
            fieldKey = "",
            labelKey = "",
            fieldType = CONSTANTS.UserField.FIELDTYPE.FIELDTYPE_TEXT,
            isActive = false,
            isExport = false,
            isImport = false,
            isVcf = false,
            isRequired = false,
            id,
            createdAt,
            updatedAt,
        }: Partial<UserField> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.client = client;
        this.name = name;
        this.fieldKey = fieldKey;
        this.labelKey = labelKey;
        this.fieldType = fieldType;
        this.isActive = isActive;
        this.isExport = isExport;
        this.isImport = isImport;
        this.isVcf = isVcf;
        this.isRequired = isRequired;
    }
}

export interface FieldsAttr {
    type: string;
}
export interface FieldOptions {
    choices: { [key: string]: string };
}
