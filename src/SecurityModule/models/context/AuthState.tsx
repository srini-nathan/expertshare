import { User } from "../../../AppModule/models";

export interface AuthState {
    isAuthenticated: boolean | null;
    loginSuccess: boolean;
    showLogin: boolean;
    token: string | null;
    user: User | null;
    loginError: string | null;
    sessionFetched: boolean;
    ip: string | null;
    roles: string[];
    clientId: number | null;
    containerId: number | null;
}
