import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { SessionDocumentApi } from "../../apis";

export class SessionDoc extends BaseEntity {
    name: string;

    container: string;

    color: string;

    constructor({
        name = "",
        container = "",
        color = "",
        id,
        createdAt,
        updatedAt,
    }: Partial<SessionDoc> = {}) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.color = color;
        this.name = name;
    }

    toString(): string {
        return SessionDocumentApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            container: this.container,
        };
    }
}
export type PSessionDoc = Partial<SessionDoc>;
