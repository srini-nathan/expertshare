import React, { Dispatch } from "react";
import axios, { AxiosError } from "axios";
import { REACT_APP_LOGIN_END_POINT } from "../../../../Settings/Config/constants";

export const ACTION_TYPES = {
    LOGIN: "authentication/LOGIN",
    GET_SESSION: "authentication/GET_SESSION",
    LOGOUT: "authentication/LOGOUT",
    CLEAR_AUTH: "authentication/CLEAR_AUTH",
    LOGIN_ERROR: "authentication/LOGIN_ERROR",
};

const user = localStorage.getItem("currentUser")
    ? JSON.parse(localStorage.getItem("currentUser") as string)
    : "";
const token = localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") as string)
    : "";

export const initialState = {
    isAuthenticated: false,
    user: "" || user,
    token: "" || token,
    errorCode: null,
    errorMessage: "",
};

export type AuthenticationState = Readonly<typeof initialState>;

export default (
    state: AuthenticationState = initialState,
    action: { type: any; payload: { user: any; token: any } }
): AuthenticationState => {
    switch (action.type) {
        // TODO: GET SESSION
        case ACTION_TYPES.LOGIN:
            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", JSON.stringify(action.payload.token));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
            };
        case ACTION_TYPES.LOGOUT:
            localStorage.clear();
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            };
        case ACTION_TYPES.LOGIN_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                token: null,
            };
        default:
            return state;
    }
};

export async function loginUser(dispatch: Dispatch<any>, loginRequest: any) {
    try {
        const response = await axios.post(
            REACT_APP_LOGIN_END_POINT,
            loginRequest
        );
        const { data } = response;
        if (data) {
            dispatch({
                type: ACTION_TYPES.LOGIN,
                payload: {
                    user: data.user,
                    token: data.token,
                },
            });
        }
    } catch (err: AxiosError | any) {
        if (err.response)
            dispatch({
                type: ACTION_TYPES.LOGIN_ERROR,
                payload: {
                    errorMessage: err.response.data,
                    errorCode: err.response.status,
                },
            });
    }
}
