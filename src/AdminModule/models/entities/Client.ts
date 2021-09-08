import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { Package } from "./Package";
import { ClientApi } from "../../apis";
import { CONSTANTS } from "../../../config";

export class Client extends BaseEntity {
    name: string;

    notes: string;

    storage: string;

    bucketKey: string;

    bucketSecret: string;

    bucketName: string;

    bucketRegion: string;

    bucketEndpoint: string;

    packages: string[] | Package[];

    constructor({
        name = "",
        notes = "",
        storage = CONSTANTS.Container.STORAGE.STORAGE_LOCAL,
        bucketKey = "",
        bucketSecret = "",
        bucketName = "",
        bucketRegion = "",
        bucketEndpoint = "",
        packages = [],
        id,
        createdAt,
        updatedAt,
    }: Partial<Client> = {}) {
        super(id, createdAt, updatedAt);
        this.name = name;
        this.notes = notes;
        this.storage = storage;
        this.bucketKey = bucketKey;
        this.bucketSecret = bucketSecret;
        this.bucketName = bucketName;
        this.bucketRegion = bucketRegion;
        this.bucketEndpoint = bucketEndpoint;
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
            storage: this.storage,
            bucketKey: this.bucketKey,
            bucketSecret: this.bucketSecret,
            bucketName: this.bucketName,
            bucketRegion: this.bucketRegion,
            bucketEndpoint: this.bucketEndpoint,
            packages: this.packages.map((p: string | Package) => p.toString()),
        };
    }
}
