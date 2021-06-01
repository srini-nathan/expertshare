import { useAuthState } from "./useAuthState";
import { API_HOST } from "../config/app-env";

export function useBuildAssetPath(folder: string, fileName?: string) {
    const { containerId } = useAuthState();

    if (fileName) {
        return `${API_HOST}/uploads/${containerId}/${folder}/${fileName}`;
    }

    return `${API_HOST}/uploads/${containerId}/${folder}`;
}
