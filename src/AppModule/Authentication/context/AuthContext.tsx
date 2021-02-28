import React, { createContext, useEffect } from "react";
import _ from "lodash";
import {
    AUTH_PROFILE,
    AUTH_TOKEN_KEY,
} from "../../../Settings/Config/constants";
import { Api, UserProfile } from "../../../lib/API/Api";

interface IAuthSate {
    isAuthenticated: boolean;
    loginSuccess: boolean;
    showLogin: boolean;
    token: string | null;
    user: UserProfile | null;
    loginError: string | null;
}

interface IAuthAction {
    type: string;
    payload: IAuthSate;
}

const initialState: IAuthSate = {
    isAuthenticated: false,
    loginSuccess: false,
    showLogin: true,
    token: null,
    user: null,
    loginError: "",
};

export const AuthContext = createContext<IAuthSate | any>(initialState);

function reducer(state: IAuthSate, action: IAuthAction): IAuthSate {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginSuccess: action.payload.loginSuccess,
                showLogin: action.payload.showLogin,
                token: action.payload.token,
            };
        case "LOGIN_ERROR":
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginSuccess: action.payload.loginSuccess,
                showLogin: action.payload.showLogin,
                loginError: action.payload.loginError,
                user: action.payload.user,
                token: action.payload.token,
            };
        default:
            return state;
    }
}

export interface LoginResponse {
    token: string;
}

type Props = {
    children: JSX.Element;
};

export const loginAction = async (
    username: string,
    password: string,
    dispatch: React.Dispatch<IAuthAction>
): Promise<void> => {
    try {
        const result: LoginResponse = await Api.login(username, password);
        if (result.token) {
            await localStorage.setItem(AUTH_TOKEN_KEY, result.token);
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: {
                    isAuthenticated: true,
                    token: result.token,
                    showLogin: false,
                    loginSuccess: true,
                    user: null,
                    loginError: null,
                },
            });
        }
    } catch (err) {
        if (localStorage.getItem(AUTH_TOKEN_KEY)) {
            await localStorage.removeItem(AUTH_TOKEN_KEY);
            dispatch({
                type: "LOGIN_SUCCESS",
                payload: {
                    isAuthenticated: true,
                    showLogin: false,
                    loginSuccess: true,
                    user: null,
                    loginError: null,
                    token: null,
                },
            });
        }
    }
};

export default function AuthProvider({ children }: Props): JSX.Element {
    const [user, setUser] = React.useState<UserProfile | null>(null);
    const [state, dispatch] = React.useReducer(reducer, initialState);

    // const [token, setToken] = React.useState<string>("");
    // const [loginSuccess, setLoginSuccess] = React.useState<boolean>(false);
    // const [showLogin, setShowLogin] = React.useState<boolean>(true);
    // const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    //     false
    // );

    useEffect(() => {
        async function fetch() {
            const result = localStorage.getItem(AUTH_TOKEN_KEY);
            if (result) {
                try {
                    const fetchedUser = await Api.fetchUserProfile();
                    setUser(fetchedUser);
                    if (!_.isEmpty(user)) {
                        await localStorage.setItem(
                            AUTH_PROFILE,
                            JSON.stringify(user)
                        );
                    }
                    // eslint-disable-next-line no-empty
                } catch (err) {}
            }
        }

        fetch().then();
        return () => {};
    }, [user]);

    // const login = async (username: string, password: string): Promise<void> => {
    //     try {
    //         const result: LoginResponse = await Api.login(username, password);
    //         setToken(result.token);
    //         setIsAuthenticated(true);
    //         setShowLogin(false);
    //         setLoginSuccess(true);
    //     } catch (err) {
    //         setShowLogin(true);
    //         setLoginSuccess(false);
    //     }
    // };
    // const register = () => {};
    // const logout = () => {
    //     if (localStorage.getItem(AUTH_TOKEN_KEY)) {
    //         localStorage.removeItem(AUTH_TOKEN_KEY);
    //     }
    //     if (localStorage.getItem(AUTH_PROFILE)) {
    //         localStorage.removeItem(AUTH_PROFILE);
    //     }
    //     setShowLogin(true);
    //     setIsAuthenticated(false);
    // };
    //
    // const value: AuthContextType = {
    //     login,
    //     logout,
    //     register,
    //     token,
    //     loginSuccess,
    //     showLogin,
    //     isAuthenticated,
    // };
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
