import { useAuthState } from "./useAuthState";
import { isGranted } from "../utils";

export function useIsGranted(roleName: string) {
    const { role } = useAuthState();

    return isGranted(role, roleName);
}
