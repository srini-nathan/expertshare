import axios from "axios";
import {
    REACT_APP_CLIENT_RESOURCE_END_POINT,
    REACT_APP_CONTAINER_RESOURCE_END_POINT,
    REACT_APP_LOGIN_END_POINT,
    REACT_APP_ME_END_POINT,
    REACT_APP_PACKAGE_RESOURCE_END_POINT,
} from "../../Settings/Config/constants";

export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt: string;
}
export interface UserProfile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    locale: string;
    client: string;
    roles: string[];
    status: string;
}

export interface HydraResponse<T> {
    "hydra:member": T[];
    hydraTotalItems: 100;
}

export interface Client extends BaseEntity {
    name: string;
    notes: string;
    packages: Package[];
}

export interface Container extends BaseEntity {
    domain: string;
    storage: string;
    configuration: string[];
    packages: Package[];
}

export interface Package {
    id: number;
    packageKey: string;
}
export interface Token {
    token: string;
}
