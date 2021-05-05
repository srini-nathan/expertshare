import { BaseEntity } from "../../../AppModule/models";
import { Package } from "./Package";
import { ContainerConfiguration } from "./ContainerConfiguration";

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
    designConfiguration: string[];
    configurationTypes: ContainerConfiguration;
    designConfigurationTypes: ContainerConfiguration;
    packages: Package[];
}
