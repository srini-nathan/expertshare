import { useContext } from "react";
import { AuthContext } from "../../SecurityModule/contexts";
import { AuthState } from "../../SecurityModule/models";
import { errorToast, parseIdFromResourceUrl } from "../utils";
import { ClientApi, ContainerApi } from "../../AdminModule/apis";
import { PUser } from "../../AdminModule/models/entities/User";

type AuthStateType = {
    clientId: number;
    role: string;
    clientResourceId: string;
    containerId: number;
    containerResourceId: string;
    token: string;
    user: PUser;
    userId: number;
    relationManagerId: number | null;
};

export function useAuthState(): AuthStateType {
    const { state } = useContext(AuthContext);
    const { clientId, containerId, roles, token, user } = state as AuthState;

    if (
        clientId === null ||
        containerId === null ||
        token === null ||
        !user ||
        !user.id
    ) {
        errorToast("Auth state is null.");
        throw new Error("Auth is null.");
    }

    const role = roles[0] ? roles[0] : "";
    const rm = user?.relationManager;

    return {
        clientId,
        role,
        clientResourceId: ClientApi.toResourceUrl(clientId),
        containerId,
        containerResourceId: ContainerApi.toResourceUrl(containerId),
        token,
        user,
        userId: user.id,
        relationManagerId: rm ? parseIdFromResourceUrl(rm) : null,
    };
}
