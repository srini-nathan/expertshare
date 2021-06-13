import { USER_LOCALE } from "../config/app-env";
import i18n from "../config/i18n";

type UserLocaleType = {
    setLocale: (locale: string) => void;
    locale: string;
};

export function useUserLocale(): UserLocaleType {
    const setLocale = (locale: string): void => {
        i18n.changeLanguage(locale);
        localStorage.setItem(USER_LOCALE, locale);
    };

    const locale = localStorage.getItem(USER_LOCALE) || "en";

    return { setLocale, locale };
}
