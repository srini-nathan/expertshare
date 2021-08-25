import { AUTH_SKIP_ONBOARDING } from "../config/app-env";

export function useSkipOnBoarding() {
    const setSkipOnBoarding = (isSet = false) => {
        localStorage.setItem(AUTH_SKIP_ONBOARDING, `${isSet}`);
    };

    const isSkipOnBoarding = () => {
        return !!localStorage.getItem(AUTH_SKIP_ONBOARDING);
    };

    return {
        setSkipOnBoarding,
        isSkipOnBoarding,
    };
}
