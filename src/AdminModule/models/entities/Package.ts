import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { PackageApi } from "../../apis";

export class Package extends BaseEntity {
    packageKey: string;

    constructor({ packageKey, id, createdAt, updatedAt }: Package) {
        super(id, createdAt, updatedAt);
        this.packageKey = packageKey;
    }

    toString(): string {
        return PackageApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            packageKey: this.packageKey,
        };
    }
}
