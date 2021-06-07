import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { SessionCategoryApi } from "../../apis";
import { Container } from "./Container";

export class SessionCategory extends BaseEntity {
    name: string;

    color: string;

    translations?: any;

    container: string | Container;

    constructor(
        container: string,
        {
            name = "",
            color = "#000",
            translations,
            id,
            createdAt,
            updatedAt,
        }: Partial<SessionCategory> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.name = name;
        this.color = color;
        this.translations = translations;
    }

    toString(): string {
        return SessionCategoryApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            color: this.color,
            translations: this.translations,
            container: this.container.toString(),
        };
    }
}
