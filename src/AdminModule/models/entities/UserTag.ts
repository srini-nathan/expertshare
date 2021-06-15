import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { UserTagApi } from "../../apis";

export class UserTag extends BaseEntity {
    client: string;

    name: string;

    constructor(
        client: string,
        { name = "", id, createdAt, updatedAt }: Partial<UserTag> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.client = client;
        this.name = name;
    }

    toString(): string {
        return UserTagApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        const data: JsonResponseData = {
            ...super.toJSON(addExtraData),
            name: this.name,
            client: this.client,
        };

        return data;
    }
}
