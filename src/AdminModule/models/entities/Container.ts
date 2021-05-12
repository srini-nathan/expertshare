import { BaseEntity } from "../../../AppModule/models";
import { Package } from "./Package";
import { ContainerConfiguration } from "./ContainerConfiguration";
import { ClientEntity } from "./Client";
import { UserGroup } from "./UserGroup";

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

export class ContainerEntity {
    domain: string;

    name: string;

    containerGroup?: string;

    storage: string;

    bucketKey?: string;

    bucketSecret?: string;

    bucketName?: string;

    bucketRegion?: string;

    isActive?: boolean;

    client?: string | ClientEntity;

    description?: string;

    packages: string[] | Package[];

    configuration?: string[];

    userGroups?: string[] | UserGroup[];

    constructor(client: string) {
        this.client = client;
        this.domain = "";
        this.name = "";
        this.storage = "Local";
        this.packages = [];
        this.isActive = true;
        this.containerGroup = "";
        this.bucketKey = "";
        this.bucketSecret = "";
        this.bucketName = "";
        this.bucketRegion = "";
        this.description = "";
        this.configuration = [];
    }
}
