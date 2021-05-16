import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { UserGroupApi } from "../../apis";

export class UserGroup extends BaseEntity {
    client: string;

    name: string;

    isGenerated: boolean;

    constructor(
        client: string,
        {
            name = "",
            isGenerated = false,
            id,
            createdAt,
            updatedAt,
        }: Partial<UserGroup> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.client = client;
        this.name = name;
        this.isGenerated = isGenerated;
    }

    toString(): string {
        return UserGroupApi.toResourceUrl(this.id);
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
