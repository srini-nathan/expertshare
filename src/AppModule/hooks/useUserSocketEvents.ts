import { useContext } from "react";
import { onUserLogin, onUserLogout, onPageChange } from "../socket";
import { ContainerApi, UserApi } from "../../AdminModule/apis";
import { AuthContext } from "../../SecurityModule/contexts";
import { AuthState } from "../../SecurityModule/models";
import { useGlobalData } from "../contexts";

type UserSocketEventsType = {
    emitLogin: () => void;
    emitLogout: () => void;
    emitPageChange: () => void;
};

export function useUserSocketEvents(): UserSocketEventsType {
    const { container } = useGlobalData();
    const { state } = useContext(AuthContext);
    const { token, user } = state as AuthState;

    const emitLogin = (): void => {
        if (user && user.id) {
            onUserLogin({
                token,
                userId: user.id,
            });
        }
    };

    const emitLogout = (): void => {
        onUserLogout();
    };

    const emitPageChange = (): void => {
        if (container && container.id) {
            onPageChange({
                url: window.location.href,
                pageTitle: document.title,
                user: user && user.id ? UserApi.toResourceUrl(user.id) : null,
                container: ContainerApi.toResourceUrl(container.id),
            });
        }
    };

    return {
        emitLogin,
        emitLogout,
        emitPageChange,
    };
}
