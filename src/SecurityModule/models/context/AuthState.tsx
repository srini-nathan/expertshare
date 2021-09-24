import { PUser } from "../../../AdminModule/models";

export interface AuthState {
    isAuthenticated: boolean | null;
    loginSuccess: boolean;
    showLogin: boolean;
    token: string | null;
    user: PUser | null;
    loginError: string | null;
    sessionFetched: boolean;
    ip: string | null;
    roles: string[];
    clientId: number | null;
    containerId: number | null;
}

export interface LoginActionConfig {
    isAuth2wayEnable: boolean;
    auth2wayRole: string[];
    isPwdGenerated: boolean;
    newPassword: string;
}
