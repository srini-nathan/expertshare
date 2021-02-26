import React, { useEffect } from "react";
import _ from "lodash";
import {
    AUTH_PROFILE,
    AUTH_TOKEN_KEY,
} from "../../../Settings/Config/constants";
import { Api } from "../../../lib/API/Api";

const AuthContext = React.createContext({});

export interface LoginResponse {
    token: string;
}
type Props = {
    children: JSX.Element;
};

function AuthProvider({ children }: Props): JSX.Element {
    const [user, setUser] = React.useState(null);
    const [token, setToken] = React.useState("");
    const [loginSuccess, setLoginSuccess] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    const fetchSession = async () => {
        try {
            const fetchedUser = await Api.fetchUserProfile();
            setUser(fetchedUser);
            if (!_.isEmpty(user)) {
                await localStorage.setItem(AUTH_PROFILE, JSON.stringify(user));
            }
        } catch (err) {
            // TODO: get idea about error json
        }
    };
    useEffect(() => {
        async function fetch() {
            const result = localStorage.getItem(AUTH_TOKEN_KEY);
            if (result) {
                await fetchSession();
            }
        }
        fetch().then();
        return () => {};
    }, [fetchSession]);

    const login = async (username: string, password: string): Promise<void> => {
        try {
            const result: LoginResponse = await Api.login(username, password);
            setToken(result.token);
            setIsAuthenticated(true);
            setShowLogin(false);
            setLoginSuccess(true);
        } catch (err) {
            setShowLogin(true);
            setLoginSuccess(false);
        }
    };
    const register = () => {};
    const logout = () => {
        if (localStorage.getItem(AUTH_TOKEN_KEY)) {
            localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        if (localStorage.getItem(AUTH_PROFILE)) {
            localStorage.removeItem(AUTH_PROFILE);
        }
        setShowLogin(true);
        setIsAuthenticated(false);
    };

    const value: {
        login: (username: string, password: string) => void;
        logout: () => void;
        register: () => void;
        token: string;
        loginSuccess: boolean;
        showLogin: boolean;
        isAuthenticated: boolean;
    } = {
        login,
        logout,
        register,
        token,
        loginSuccess,
        showLogin,
        isAuthenticated,
    };
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
export default AuthProvider;
const useAuth = () => React.useContext(AuthContext);
export { useAuth };
