import { BaseEntity } from "../../../AppModule/models";
import { Package } from "./Package";

export interface Container extends BaseEntity {
    domain: string;
    containerGroup: string;
    storage: string;
    bucketKey: string;
    bucketSecret: string;
    bucketName: string;
    isActive: boolean;
    client: string;
    configuration: string[];
    packages: Package[];
}
