import { useContext } from "react";
import { AuthContext } from "../../SecurityModule/context";
import { AuthState } from "../../SecurityModule/models";
import { errorToast } from "../utils";
import { ClientApi, ContainerApi } from "../../AdminModule/apis";

export function useAuthState() {
    const { state } = useContext(AuthContext);
    const { clientId, containerId } = state as AuthState;

    if (clientId === null || containerId === null) {
        throw new Error("ClientId or ContainerId is null.");
        errorToast("ClientId or ContainerId is null.");
    }

    return {
        clientId,
        clientResourceId: ClientApi.toResourceUrl(clientId),
        containerId,
        containerResourceId: ContainerApi.toResourceUrl(containerId),
    };
}
