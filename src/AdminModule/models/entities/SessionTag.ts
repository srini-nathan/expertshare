import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { ConferenceApi } from "../../apis";

export class SessionTag extends BaseEntity {
    name: string;

    container: string;

    constructor({
        name = "",
        container = "",
        id,
        createdAt,
        updatedAt,
    }: Partial<SessionTag> = {}) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.name = name;
    }

    toString(): string {
        return ConferenceApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            container: this.container,
        };
    }
}
export type PSessionTag = Partial<SessionTag>;
