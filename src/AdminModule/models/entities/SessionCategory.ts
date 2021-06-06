import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { SessionCategoryApi } from "../../apis";
import { Container } from "./Container";

export class SessionCategory extends BaseEntity {
    name: string;

    color: string;

    isDefault: boolean;

    container: string | Container;

    constructor(
        container: string,
        {
            name = "",
            color = "#000",
            isDefault = false,
            id,
            createdAt,
            updatedAt,
        }: Partial<SessionCategory> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.name = name;
        this.color = color;
        this.isDefault = isDefault;
    }

    toString(): string {
        return SessionCategoryApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            color: this.color,
            isDefault: this.isDefault,
            container: this.container.toString(),
        };
    }
}
