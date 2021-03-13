import axios from "axios";
import {
    REACT_APP_CLIENT_RESOURCE_END_POINT,
    REACT_APP_CONTAINER_RESOURCE_END_POINT,
    REACT_APP_LOGIN_END_POINT,
} from "../../Settings/Config/constants";

export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt: string;
}
export interface UserProfile {
    username: string;
    roles: string[];
    permissions: string[];
    email: string;
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
}

export interface Token {
    token: string;
}
export class Api {
    static async fetchUserProfile(): Promise<UserProfile> {
        return new Promise((resolve) =>
            setTimeout(() => {
                return resolve({
                    username: "Mash",
                    roles: ["SUPER-ADMIN", "ADMIN"],
                    permissions: ["ALL", "NONE"],
                    email: "moshiour0027@gmail.com",
                });
            }, 1000)
        );
    }

    static async login(email: string, password: string): Promise<Token> {
        const res = await axios.post<Token>(REACT_APP_LOGIN_END_POINT, {
            email,
            password,
        });
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

    static async createClient(name: string, notes: string): Promise<Client> {
        const res = await axios.post<Client>(
            `${REACT_APP_CLIENT_RESOURCE_END_POINT}`,
            { name, notes }
        );
        return res.data;
    }

    static async updateClient(
        name: string,
        notes: string,
        id: number
    ): Promise<Client> {
        const res = await axios.put<Client>(
            `${REACT_APP_CLIENT_RESOURCE_END_POINT}/${id}`,
            { name, notes }
        );
        return res.data;
    }
}
