import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { Package } from "./Package";
import { ClientApi } from "../../apis";

export class Client extends BaseEntity {
    name: string;

    notes: string;

    packages: string[] | Package[];

    constructor({
        name = "",
        notes = "",
        packages = [],
        id,
        createdAt,
        updatedAt,
    }: Partial<Client> = {}) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.notes = notes;
        this.packages = packages;
    }

    toString(): string {
        return ClientApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            notes: this.notes,
            packages: this.packages.map((p: string | Package) => p.toString()),
        };
    }
}
