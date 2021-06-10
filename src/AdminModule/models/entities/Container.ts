import { BaseEntity, JsonResponseData } from "../../../AppModule/models";
import { Package } from "./Package";
import { Client } from "./Client";
import { UserGroup } from "./UserGroup";
import { CONSTANTS } from "../../../config";
import { ContainerApi } from "../../apis";

export class Container extends BaseEntity {
    domain: string;

    name: string;

    containerGroup: string;

    storage: string;

    bucketKey: string;

    bucketSecret: string;

    bucketName: string;

    bucketRegion: string;

    bucketEndpoint: string;

    isActive: boolean;

    description: string;

    configuration: string[];

    configurationTypes: string[];

    designConfiguration: string[];

    designConfigurationTypes: string[];

    client: string | Client;

    packages: string[] | Package[];

    userGroups: string[] | UserGroup[];

    imageName: string;

    constructor(
        client: string,
        {
            domain = "",
            name = "",
            storage = CONSTANTS.Container.STORAGE.STORAGE_LOCAL,
            packages = [],
            isActive = true,
            containerGroup = "",
            bucketKey = "",
            bucketSecret = "",
            bucketName = "",
            bucketRegion = "",
            bucketEndpoint = "",
            description = "",
            configuration = [],
            configurationTypes = [],
            designConfiguration = [],
            designConfigurationTypes = [],
            userGroups = [],
            imageName = "",
            id,
            createdAt,
            updatedAt,
        }: Partial<Container> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.client = client;
        this.domain = domain;
        this.name = name;
        this.storage = storage;
        this.packages = packages;
        this.isActive = isActive;
        this.containerGroup = containerGroup;
        this.userGroups = userGroups;
        this.bucketKey = bucketKey;
        this.bucketSecret = bucketSecret;
        this.bucketName = bucketName;
        this.bucketRegion = bucketRegion;
        this.bucketEndpoint = bucketEndpoint;
        this.description = description;
        this.configuration = configuration;
        this.configurationTypes = configurationTypes;
        this.designConfiguration = designConfiguration;
        this.designConfigurationTypes = designConfigurationTypes;
        this.imageName = imageName;
    }

    toString(): string {
        return ContainerApi.toResourceUrl(this.id);
    }

    toJSON(addExtraData = false): JsonResponseData {
        return {
            ...super.toJSON(addExtraData),
            name: this.name,
            client: this.client.toString(),
            domain: this.domain,
            storage: this.storage,
            packages: this.packages.map((p: string | Package) => p.toString()),
            isActive: this.isActive,
            containerGroup: this.containerGroup,
            userGroups: this.userGroups.map((p: string | UserGroup) =>
                p.toString()
            ),
            bucketKey: this.bucketKey,
            bucketSecret: this.bucketSecret,
            bucketName: this.bucketName,
            bucketRegion: this.bucketRegion,
            bucketEndpoint: this.bucketEndpoint,
            description: this.description,
            configuration: this.configuration,
            configurationTypes: this.configurationTypes,
            designConfiguration: this.designConfiguration,
            designConfigurationTypes: this.designConfigurationTypes,
            imageName: this.imageName,
        };
    }
}

export type PContainer = Partial<Container>;
