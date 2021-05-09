import { BaseEntity } from "../../../AppModule/models";

export interface Package extends BaseEntity {
    packageKey: string;
}

export class PackageEntity {
    packageKey: string;

    constructor(packageKey: string) {
        this.packageKey = packageKey;
    }
}
