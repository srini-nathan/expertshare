import React, { createContext, useEffect } from "react";
import { navigate } from "@reach/router";
import { first } from "lodash";
import jwtDecode from "jwt-decode";
import { AuthApi, LoginResponse } from "../apis/AuthApi";
import {
    AUTH_CHOSEN_CONTAINER,
    AUTH_TOKEN_KEY,
    AUTH_USER_KEY,
    AUTH_SKIP_ONBOARDING,
} from "../../AppModule/config/app-env";
import { AuthState, LoginActionConfig } from "../models/context/AuthState";
import { clearAuthStorage, setUserLocale } from "../utils";
import { UserApi } from "../../AdminModule/apis";
import { PUser } from "../../AdminModule/models";

interface IAuthAction {
    type: AuthActionTypes;
    payload: AuthState;
}

const initialState: AuthState = {
    isAuthenticated: null,
    loginSuccess: false,
    showLogin: true,
    token: null,
    user: null,
    loginError: "",
    sessionFetched: false,
    ip: null,
    roles: [],
    clientId: null,
    containerId: null,
};

enum AuthActionTypes {
    LOGIN_SUCCESS,
    LOGIN_ERROR,
    LOGOUT,
}
export const AuthContext = createContext<AuthState | any>(initialState);

export const buildConfig = (authToken: string) => {
    return {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    };
};

function reducer(state: AuthState, action: IAuthAction): AuthState {
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
                clientId: action.payload.clientId,
                containerId: action.payload.containerId,
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
                clientId: action.payload.clientId,
                containerId: action.payload.containerId,
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
                clientId: action.payload.clientId,
                containerId: action.payload.containerId,
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
    await clearAuthStorage();
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
            containerId: null,
            clientId: null,
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

export const loginByToken = async (
    token: string,
    dispatch: React.Dispatch<IAuthAction>
): Promise<void> => {
    try {
        if (token) {
            const { ip, roles, cid, cntid }: JWT = await jwtDecode(token);
            await localStorage.setItem(AUTH_TOKEN_KEY, token);
            const user = await AuthApi.me(buildConfig(token));
            await localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            await setUserLocale(user);
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
                    clientId: cid,
                    containerId: cntid,
                },
            });
            await navigate("/");
        }
    } catch (err) {
        if (localStorage.getItem(AUTH_TOKEN_KEY)) {
            await clearAuthStorage();
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
                    containerId: null,
                    clientId: null,
                },
            });
        }
    }
};

export const autoLogin = async (
    token: string,
    dispatch: React.Dispatch<IAuthAction>,
    skip = null
): Promise<void> => {
    await clearAuthStorage();
    if (skip === "1") {
        localStorage.setItem(AUTH_CHOSEN_CONTAINER, "true");
        localStorage.setItem(AUTH_SKIP_ONBOARDING, "true");
    }
    return loginByToken(token, dispatch);
};

export const loginFailureAction = async (
    dispatch: React.Dispatch<IAuthAction>
) => {
    await clearAuthStorage();
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
            containerId: null,
            clientId: null,
        },
    });
};

export const loginAction = async (
    username: string,
    password: string,
    dispatch: React.Dispatch<IAuthAction>,
    configuration: LoginActionConfig
): Promise<void> => {
    try {
        const result: LoginResponse = await AuthApi.login({
            email: username,
            password,
        });
        const { token } = result;
        if (token) {
            const {
                isAuth2wayEnable,
                auth2wayRole,
                isPwdGenerated,
                newPassword,
            } = configuration;
            const { ip, roles, cid, cntid }: JWT = await jwtDecode(token);
            const role = first(roles);
            const is2FA =
                isAuth2wayEnable && role && auth2wayRole.indexOf(role) !== -1;
            if (!isPwdGenerated && is2FA) {
                await navigate(`/auth/verify-otp/${token}`);
            } else {
                const user = await AuthApi.me(buildConfig(token));
                if (isPwdGenerated) {
                    const { id } = user;
                    await UserApi.changePassword<PUser, PUser>(
                        id,
                        {
                            plainPassword: newPassword,
                        },
                        buildConfig(token)
                    );
                    user.isPwdGenerated = false;
                }
                if (!is2FA) {
                    await localStorage.setItem(AUTH_TOKEN_KEY, token);
                    await localStorage.setItem(
                        AUTH_USER_KEY,
                        JSON.stringify(user)
                    );
                    await setUserLocale(user);
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
                            clientId: cid,
                            containerId: cntid,
                        },
                    });
                    await navigate("/");
                } else {
                    await navigate(`/auth/verify-otp/${token}`);
                }
            }
        }
    } catch (err) {
        await loginFailureAction(dispatch);
    }
};

export default function AuthProvider({ children }: Props): JSX.Element {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const fetchSession = async () => {
        if (localStorage.getItem(AUTH_TOKEN_KEY)) {
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (token) {
                try {
                    const user = await AuthApi.me(buildConfig(token));
                    const { ip, roles, cid, cntid }: JWT = jwtDecode(token);
                    await setUserLocale(user);
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
                            clientId: cid,
                            containerId: cntid,
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
                            clientId: null,
                            containerId: null,
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
                    clientId: null,
                    containerId: null,
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
