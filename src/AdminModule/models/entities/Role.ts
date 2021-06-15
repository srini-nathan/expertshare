import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { RoleApi } from "../../apis";

export class Role extends BaseEntity {
    name: string;

    role: string;

    constructor({
        name = "",
        role = "",
        id,
        createdAt,
        updatedAt,
    }: Partial<Role> = {}) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.role = role;
    }

    toString(): string {
        return RoleApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
        };
    }
}
