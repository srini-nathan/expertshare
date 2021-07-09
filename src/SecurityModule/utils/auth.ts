import {
    AUTH_CHOSEN_CONTAINER,
    AUTH_SKIP_ONBOARDING,
    AUTH_TOKEN_KEY,
    AUTH_USER_KEY,
} from "../../AppModule/config/app-env";

export const clearAuthStorage = async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_CHOSEN_CONTAINER);
    localStorage.removeItem(AUTH_SKIP_ONBOARDING);
};
