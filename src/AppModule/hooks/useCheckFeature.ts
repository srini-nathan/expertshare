import { useGlobalData } from "../contexts";
import { useAuthState } from "./useAuthState";
import { Configuration } from "../../AdminModule/models";
import { CONSTANTS } from "../../config";

const {
    Role: { ROLE },
} = CONSTANTS;

export function useCheckFeature() {
    const { container } = useGlobalData();
    const { user, role } = useAuthState();
    const configuration: Configuration = (container?.configuration as unknown) as Configuration;

    const isChatEnable = (): boolean => {
        if (configuration?.isChatEnable) {
            if (role === ROLE.ROLE_READER) {
                return false;
            }
            if (user.isDisplayAsGuest) {
                return false;
            }
            if (!user.isAllowCommunication) {
                return false;
            }
            return true;
        }

        return false;
    };

    return {
        isChatEnable,
    };
}
