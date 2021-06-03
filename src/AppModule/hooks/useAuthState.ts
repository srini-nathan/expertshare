import { useContext } from "react";
import { AuthContext } from "../../SecurityModule/contexts";
import { AuthState } from "../../SecurityModule/models";
import { errorToast } from "../utils";
import { ClientApi, ContainerApi } from "../../AdminModule/apis";

export function useAuthState() {
    const { state } = useContext(AuthContext);
    const { clientId, containerId, roles, token } = state as AuthState;

    if (clientId === null || containerId === null) {
        errorToast("ClientId or ContainerId is null.");
        throw new Error("ClientId or ContainerId is null.");
    }
    const role = roles[0] ? roles[0] : "";

    return {
        clientId,
        role,
        clientResourceId: ClientApi.toResourceUrl(clientId),
        containerId,
        containerResourceId: ContainerApi.toResourceUrl(containerId),
        token,
    };
}
