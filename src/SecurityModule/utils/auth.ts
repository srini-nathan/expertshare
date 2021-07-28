import {
    AUTH_CHOSEN_CONTAINER,
    AUTH_SKIP_ONBOARDING,
    AUTH_USER_KEY,
    AUTH_TOKEN_KEY,
    CONTAINER_LOCALE,
    USER_LOCALE,
} from "../../AppModule/config/app-env";
import i18n from "../../AppModule/config/i18n";
import { User } from "../../AppModule/models";

export const clearAuthStorage = async () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_CHOSEN_CONTAINER);
    localStorage.removeItem(AUTH_SKIP_ONBOARDING);
};

export const setUserLocale = async (user: User) => {
    const { locale } = user;
    if (locale !== "") {
        await localStorage.setItem(USER_LOCALE, locale);
        i18n.changeLanguage(locale);
    } else {
        const cLocale = await localStorage.getItem(CONTAINER_LOCALE);
        if (cLocale) {
            await localStorage.setItem(USER_LOCALE, locale);
            i18n.changeLanguage(cLocale);
        } else {
            // eslint-disable-next-line no-console
            console.error("unable to set locale", "setUserLocale");
        }
    }
};
