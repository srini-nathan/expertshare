import { BaseEntity, JsonResponseData } from "../../../AppModule/models";

export class UserGroup extends BaseEntity {
    client: string;

    name: string;

    isGenerated: boolean;

    constructor(
        client: string,
        name = "",
        id?: number,
        createdAt?: string | Date,
        updatedAt?: string | Date
    ) {
        super(id, createdAt, updatedAt);
        this.client = client;
        this.name = name;
        this.isGenerated = false;
    }

    toJSON(addExtraData = false): JsonResponseData {
        let data: JsonResponseData = {
            ...super.toJSON(addExtraData),
            name: this.name,
            client: this.client,
        };

        if (addExtraData) {
            data = {
                ...data,
                isGenerated: this.isGenerated,
            };
        }

        return data;
    }
}
