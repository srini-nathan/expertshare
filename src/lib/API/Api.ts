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
}
export interface Client extends BaseEntity {
    name: string;
    notes: string;
    packages: Package[];
}

export interface Package {
    id: number;
    packageKey: string;
}
export interface Token {
    token: string;
}
export class Api {
    static async login(email: string, password: string): Promise<Token> {
        const res = await axios.post<Token>(REACT_APP_LOGIN_END_POINT, {
            email,
            password,
        });
        return res.data;
    }

    static async fetchProfile(): Promise<UserProfile> {
        const res = await axios.get<UserProfile>(`${REACT_APP_ME_END_POINT}`);
        return res.data;
    }

    static async getClientHydra(
        pageNo: number
    ): Promise<HydraResponse<Client>> {
        const res = await axios.get<HydraResponse<Client>>(
            `${REACT_APP_CLIENT_RESOURCE_END_POINT}?page=${pageNo}`,
            {
                headers: {
                    accept: "application/ld+json",
                },
            }
        );
        return res.data;
    }

    static async getClients(pageNo: number): Promise<Client[]> {
        const res = await axios.get<Client[]>(
            `${REACT_APP_CLIENT_RESOURCE_END_POINT}?page=${pageNo}`
        );
        return res.data;
    }

    static async getClient(id: number): Promise<Client> {
        const res = await axios.get<Client>(
            `${REACT_APP_CLIENT_RESOURCE_END_POINT}/${id}`
        );
        return res.data;
    }

    static async getContainers(pageNo: number): Promise<Container[]> {
        const res = await axios.get<Container[]>(
            `${REACT_APP_CONTAINER_RESOURCE_END_POINT}?page${pageNo}`
        );
        return res.data;
    }

    static async createClient(
        name: string,
        notes: string,
        active: boolean
    ): Promise<Client> {
        const res = await axios.post<Client>(
            `${REACT_APP_CLIENT_RESOURCE_END_POINT}`,
            { name, notes, active }
        );
        return res.data;
    }

    static async updateClient(
        name: string,
        notes: string,
        active: boolean,
        id: number
    ): Promise<Client> {
        const res = await axios.put<Client>(
            `${REACT_APP_CLIENT_RESOURCE_END_POINT}/${id}`,
            { name, notes }
        );
        return res.data;
    }

    static async getPackages(): Promise<Package[]> {
        const res = await axios.get<Package[]>(
            `${REACT_APP_PACKAGE_RESOURCE_END_POINT}`
        );
        return res.data;
    }
}
