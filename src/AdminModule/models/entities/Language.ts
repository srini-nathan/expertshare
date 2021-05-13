import { BaseEntity, JsonResponseData } from "../../../AppModule/models";

export class Language extends BaseEntity {
    name: string;

    locale: string;

    isActive: boolean;

    isDefault: boolean;

    container: string;

    constructor(
        container: string,
        name = "",
        locale = "",
        isActive = true,
        isDefault = false,
        id?: number,
        createdAt?: string | Date,
        updatedAt?: string | Date
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.name = name;
        this.locale = locale;
        this.isActive = isActive;
        this.isDefault = isDefault;
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            locale: this.locale,
            isDefault: this.isDefault,
            container: this.container,
        };
    }
}
