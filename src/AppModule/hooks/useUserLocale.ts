import { USER_LOCALE, CONTAINER_LOCALE } from "../config/app-env";
import i18n from "../config/i18n";

type UserLocaleType = {
    setLocale: (locale: string) => void;
    setContainerLocale: (locale: string) => void;
    locale: string;
    containerLocale: string;
};

export function useUserLocale(): UserLocaleType {
    const setLocale = (locale: string): void => {
        i18n.changeLanguage(locale);
        localStorage.setItem(USER_LOCALE, locale);
    };

    const setContainerLocale = (locale: string): void => {
        localStorage.setItem(CONTAINER_LOCALE, locale);
    };

    const locale = localStorage.getItem(USER_LOCALE) || "";
    const containerLocale = localStorage.getItem(CONTAINER_LOCALE) || "en";

    return { setLocale, locale, setContainerLocale, containerLocale };
}
