import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { InfoPageApi } from "../../apis";
import { Container } from "./Container";
import { InfoPageTranslations } from "./InfoPageTranslations";

export class InfoPage extends BaseEntity {
    translations: InfoPageTranslations[];

    slugKey: string;

    isActive: boolean;

    container: string | Container;

    constructor(
        container: string,
        {
            slugKey = "",
            isActive = true,
            translations = [],
            id,
            createdAt,
            updatedAt,
        }: Partial<InfoPage> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.slugKey = slugKey;
        this.isActive = isActive;
        this.translations = translations;
    }

    toString(): string {
        return InfoPageApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            isActive: this.isActive,
            slugKey: this.slugKey,
            container: this.container.toString(),
        };
    }
}
