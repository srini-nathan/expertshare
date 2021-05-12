import { User } from "../../../AppModule/models";

export interface AuthSate {
    isAuthenticated: boolean | null;
    loginSuccess: boolean;
    showLogin: boolean;
    token: string | null;
    user: User | null;
    loginError: string | null;
    sessionFetched: boolean;
    ip: string | null;
    roles: string[];
    // @TODO: rename this key to clientId
    cid: number | null;
    // @TODO: rename this key to containerId
    cntid: number | null;
}
