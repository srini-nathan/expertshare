import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { SessionCategoryApi } from "../../apis";

export class SessionCategory extends BaseEntity {
    name: string;

    container: string;

    color: string;

    textColor: string;

    constructor({
        name = "",
        container = "",
        color = "",
        textColor = "",
        id,
        createdAt,
        updatedAt,
    }: Partial<SessionCategory> = {}) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.color = color;
        this.textColor = textColor;
        this.name = name;
    }

    toString(): string {
        return SessionCategoryApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            container: this.container,
        };
    }
}
export type PSessionCategory = Partial<SessionCategory>;
