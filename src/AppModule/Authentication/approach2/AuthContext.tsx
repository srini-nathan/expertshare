import React, { useEffect } from "react";
import _ from "lodash";
import {
    AUTH_PROFILE,
    AUTH_TOKEN_KEY,
} from "../../../Settings/Config/constants";
import { Api } from "../../../lib/API/Api";

const AuthContext = React.createContext(null);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AuthProviderProps {}
function AuthProvider(props: AuthProviderProps): JSX.Element {
    const [user, setUser] = React.useState(null);
    const [token, setToken] = React.useState("");
    const [loginSuccess, setLoginSuccess] = React.useState(false);
    const [showLogin, setShowLogin] = React.useState(true);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    useEffect(async () => {
        () => {
            const token = await localStorage.getItem(AUTH_TOKEN_KEY);
            if (token) {
            }
        };
    }, []);

    const fetchSession = async () => {
        try {
            const fetchedUser = await Api.fetchUserProfile();
            setUser(fetchedUser);
            if (!_.isEmpty(user)) {
                localStorage.setItem(AUTH_PROFILE, JSON.stringify(user));
            }
        } catch (err) {
            // TODO: get idea about error json
        }
    };

    const login = async (username, password) => {
        try {
            const result = await login(username, password);
            setUser(result.user);
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

    return (
        <AuthContext.Provider
            value={{
                login,
                logout,
                register,
                user,
                token,
                loginSuccess,
                showLogin,
                isAuthenticated,
            }}
            {...props}
        />
    );
}

const useAuth = () => React.useContext(AuthContext);
export { AuthContext, useAuth };
