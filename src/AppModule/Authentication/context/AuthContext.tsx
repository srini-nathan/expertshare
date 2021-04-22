import React, { createContext, useEffect } from "react";
import { navigate } from "@reach/router";
import { User } from "../../models";
import { AuthApi, LoginResponse } from "../../../SecurityModule/apis/AuthApi";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from "../../config/app-env";
import { UserApi } from "../../apis/UserApi";

interface IAuthSate {
    isAuthenticated: boolean | null;
    loginSuccess: boolean;
    showLogin: boolean;
    token: string | null;
    user: User | null;
    loginError: string | null;
    sessionFetched: boolean;
}

interface IAuthAction {
    type: AuthActionTypes;
    payload: IAuthSate;
}

const initialState: IAuthSate = {
    isAuthenticated: null,
    loginSuccess: false,
    showLogin: true,
    token: null,
    user: null,
    loginError: "",
    sessionFetched: false,
};

enum AuthActionTypes {
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
}
export const AuthContext = createContext<IAuthSate | any>(initialState);

function reducer(state: IAuthSate, action: IAuthAction): IAuthSate {
    switch (action.type) {
        case AuthActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: action.payload.isAuthenticated,
                loginSuccess: action.payload.loginSuccess,
                showLogin: action.payload.showLogin,
                token: action.payload.token,
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
    if (localStorage.getItem(AUTH_TOKEN_KEY)) {
        await localStorage.removeItem(AUTH_TOKEN_KEY);
        await localStorage.removeItem(AUTH_USER_KEY);
    }
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
        },
    });
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

        if (result.token) {
            await localStorage.setItem(AUTH_TOKEN_KEY, result.token);
            const user = await UserApi.me();
            await localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            dispatch({
                type: AuthActionTypes.LOGIN_SUCCESS,
                payload: {
                    isAuthenticated: true,
                    token: result.token,
                    showLogin: false,
                    loginSuccess: true,
                    user,
                    loginError: null,
                    sessionFetched: true,
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
