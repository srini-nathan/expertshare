import { io } from "socket.io-client";
import { SOCKET_HOST } from "./config/app-env";

export const socket = io(SOCKET_HOST, {
    transports: ["websocket"],
});

export const EVENTS = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    PAGE_CHANGE: "on-page-change",
    USER_LOGIN: "on-user-login",
    USER_LOGOUT: "on-user-logout",
};

type OnPageChangePayload = {
    url: string;
    pageTitle: string;
    container: string;
    user?: string | null;
};

export const onPageChange = ({
    user = null,
    ...rest
}: OnPageChangePayload): void => {
    socket.emit(EVENTS.PAGE_CHANGE, {
        user,
        ...rest,
    });
};

type OnUserLoginPayload = {
    token: string | null;
    userId: number | null;
};

export const onUserLogin = ({ token, userId }: OnUserLoginPayload): void => {
    socket.emit(EVENTS.USER_LOGIN, {
        token,
        userId,
    });
};

export const onUserLogout = (): void => {
    socket.emit(EVENTS.USER_LOGOUT, {
        token: null,
        userId: null,
    });
};
