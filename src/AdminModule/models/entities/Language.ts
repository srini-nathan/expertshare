import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { LanguageApi } from "../../apis";
import { Container } from "./Container";

export class Language extends BaseEntity {
    name: string;

    locale: string;

    isActive: boolean;

    isDefault: boolean;

    container: string | Container;

    constructor(
        container: string,
        {
            name = "",
            locale = "",
            isActive = true,
            isDefault = false,
            id,
            createdAt,
            updatedAt,
        }: Partial<Language> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.name = name;
        this.locale = locale;
        this.isActive = isActive;
        this.isDefault = isDefault;
    }

    toString(): string {
        return LanguageApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            locale: this.locale,
            isActive: this.isActive,
            isDefault: this.isDefault,
            container: this.container.toString(),
        };
    }
}
