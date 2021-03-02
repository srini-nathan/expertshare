import React, { createContext, useEffect } from "react";
import { navigate } from "@reach/router";
import { AUTH_TOKEN_KEY } from "../../../Settings/Config/constants";
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
    type: AuthActionTypes;
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

export interface LoginResponse {
    token: string;
}

type Props = {
    children: JSX.Element;
};

export const logoutAction = async (
    dispatch: React.Dispatch<IAuthAction>
): Promise<void> => {
    if (localStorage.getItem(AUTH_TOKEN_KEY)) {
        await localStorage.removeItem(AUTH_TOKEN_KEY);
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
        },
    });
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
                type: AuthActionTypes.LOGIN_SUCCESS,
                payload: {
                    isAuthenticated: true,
                    token: result.token,
                    showLogin: false,
                    loginSuccess: true,
                    user: null,
                    loginError: null,
                },
            });
            await navigate("/");
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
                },
            });
        }
    }
};

export default function AuthProvider({ children }: Props): JSX.Element {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    useEffect(() => {
        if (localStorage.getItem(AUTH_TOKEN_KEY)) {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            dispatch({
                type: AuthActionTypes.LOGIN_SUCCESS,
                payload: {
                    isAuthenticated: true,
                    loginError: null,
                    token,
                    loginSuccess: true,
                    showLogin: false,
                    user: null,
                },
            });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}
