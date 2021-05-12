import React, { createContext, useEffect } from "react";
import { navigate } from "@reach/router";
import jwtDecode from "jwt-decode";
import { AuthApi, LoginResponse } from "../apis/AuthApi";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../AppModule/config/app-env";
import { UserApi } from "../../AppModule/apis/UserApi";
import { AuthSate } from "../models/context/AuthSate";

interface IAuthAction {
    type: AuthActionTypes;
    payload: AuthSate;
}

const initialState: AuthSate = {
    isAuthenticated: null,
    loginSuccess: false,
    showLogin: true,
    token: null,
    user: null,
    loginError: "",
    sessionFetched: false,
    ip: null,
    roles: [],
    cid: null,
    cntid: null,
};

enum AuthActionTypes {
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
}
export const AuthContext = createContext<AuthSate | any>(initialState);

function reducer(state: AuthSate, action: IAuthAction): AuthSate {
    switch (action.type) {
        case AuthActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginSuccess: action.payload.loginSuccess,
                showLogin: action.payload.showLogin,
                token: action.payload.token,
                ip: action.payload.ip,
                roles: action.payload.roles,
                user: action.payload.user,
                cid: action.payload.cid,
                cntid: action.payload.cntid,
            };
        case AuthActionTypes.LOGIN_ERROR:
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginSuccess: action.payload.loginSuccess,
                showLogin: action.payload.showLogin,
                loginError: action.payload.loginError,
                user: action.payload.user,
                token: action.payload.token,
                ip: action.payload.ip,
                roles: action.payload.roles,
                cid: action.payload.cid,
                cntid: action.payload.cntid,
            };
        case AuthActionTypes.LOGOUT:
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginSuccess: action.payload.loginSuccess,
                showLogin: action.payload.showLogin,
                loginError: action.payload.loginError,
                user: action.payload.user,
                token: action.payload.token,
                ip: action.payload.ip,
                roles: action.payload.roles,
                cid: action.payload.cid,
                cntid: action.payload.cntid,
            };
        default:
            return state;
    }
}

type Props = {
    children: JSX.Element;
};

export const logoutAction = async (
    dispatch: React.Dispatch<IAuthAction>
): Promise<void> => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    dispatch({
        type: AuthActionTypes.LOGOUT,
        payload: {
            loginError: "",
            token: null,
            user: null,
            showLogin: true,
            loginSuccess: false,
            isAuthenticated: false,
            sessionFetched: false,
            ip: null,
            roles: [],
            cntid: null,
            cid: null,
        },
    });
    await navigate("/");
};
export interface JWT {
    ip: string | null;
    roles: string[];
    cid: number;
    cntid: number;
}

export const socialLogin = async (
    token: string,
    dispatch: React.Dispatch<IAuthAction>
): Promise<void> => {
    try {
        if (token) {
            const { ip, roles, cid, cntid }: JWT = await jwtDecode(token);
            await localStorage.setItem(AUTH_TOKEN_KEY, token);
            const user = await UserApi.me();
            await localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            dispatch({
                type: AuthActionTypes.LOGIN_SUCCESS,
                payload: {
                    ip,
                    roles,
                    isAuthenticated: true,
                    token,
                    showLogin: false,
                    loginSuccess: true,
                    user,
                    loginError: null,
                    sessionFetched: true,
                    cid,
                    cntid,
                },
            });
            await navigate("/home");
        }
    } catch (err) {
        if (localStorage.getItem(AUTH_TOKEN_KEY)) {
            await localStorage.removeItem(AUTH_TOKEN_KEY);
            dispatch({
                type: AuthActionTypes.LOGIN_ERROR,
                payload: {
                    isAuthenticated: true,
                    showLogin: false,
                    loginSuccess: true,
                    user: null,
                    loginError: null,
                    token: null,
                    sessionFetched: false,
                    ip: null,
                    roles: [],
                    cntid: null,
                    cid: null,
                },
            });
        }
    }
};

export const loginAction = async (
    username: string,
    password: string,
    dispatch: React.Dispatch<IAuthAction>
): Promise<void> => {
    try {
        const result: LoginResponse = await AuthApi.login({
            email: username,
            password,
        });
        const { token } = result;
        if (token) {
            const { ip, roles, cid, cntid }: JWT = await jwtDecode(token);
            await localStorage.setItem(AUTH_TOKEN_KEY, token);
            const user = await UserApi.me();
            await localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            dispatch({
                type: AuthActionTypes.LOGIN_SUCCESS,
                payload: {
                    ip,
                    roles,
                    isAuthenticated: true,
                    token,
                    showLogin: false,
                    loginSuccess: true,
                    user,
                    loginError: null,
                    sessionFetched: true,
                    cid,
                    cntid,
                },
            });
            await navigate("/home");
        }
    } catch (err) {
        if (localStorage.getItem(AUTH_TOKEN_KEY)) {
            await localStorage.removeItem(AUTH_TOKEN_KEY);
            dispatch({
                type: AuthActionTypes.LOGIN_ERROR,
                payload: {
                    isAuthenticated: true,
                    showLogin: false,
                    loginSuccess: true,
                    user: null,
                    loginError: null,
                    token: null,
                    sessionFetched: false,
                    ip: null,
                    roles: [],
                    cntid: null,
                    cid: null,
                },
            });
        }
    }
};

export default function AuthProvider({ children }: Props): JSX.Element {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const fetchSession = async () => {
        if (localStorage.getItem(AUTH_TOKEN_KEY)) {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (token) {
                try {
                    const user = await UserApi.me();
                    const { ip, roles, cid, cntid }: JWT = jwtDecode(token);
                    dispatch({
                        type: AuthActionTypes.LOGIN_SUCCESS,
                        payload: {
                            isAuthenticated: true,
                            loginError: null,
                            sessionFetched: true,
                            token,
                            loginSuccess: true,
                            showLogin: false,
                            user,
                            ip,
                            roles,
                            cid,
                            cntid,
                        },
                    });
                } catch (error) {
                    dispatch({
                        type: AuthActionTypes.LOGIN_SUCCESS,
                        payload: {
                            isAuthenticated: false,
                            loginError: null,
                            sessionFetched: false,
                            token: null,
                            loginSuccess: false,
                            showLogin: true,
                            user: null,
                            ip: null,
                            roles: [],
                            cid: null,
                            cntid: null,
                        },
                    });
                }
            }
        } else {
            dispatch({
                type: AuthActionTypes.LOGIN_SUCCESS,
                payload: {
                    isAuthenticated: false,
                    loginError: null,
                    sessionFetched: false,
                    token: null,
                    loginSuccess: false,
                    showLogin: true,
                    user: null,
                    ip: null,
                    roles: [],
                    cid: null,
                    cntid: null,
                },
            });
        }
    };
    useEffect(() => {
        fetchSession().then();
    }, []);
    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
