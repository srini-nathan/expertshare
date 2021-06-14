import { AUTH_SKIP_ONBOARDING } from "../config/app-env";

export function useSkipOnboarding() {
    const setSkipOnboarding = (isSet = false) => {
        localStorage.setItem(AUTH_SKIP_ONBOARDING, `${isSet}`);
    };

    const isSkipOnboarding = () => {
        return !!localStorage.getItem(AUTH_SKIP_ONBOARDING);
    };

    return { setSkipOnboarding, isSkipOnboarding };
}
