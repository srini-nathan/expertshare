import { useRecoilState } from "recoil";
import { USER_LOCALE, CONTAINER_LOCALE } from "../config/app-env";
import i18n from "../config/i18n";
import { appUserLocale } from "../atoms";

type UserLocaleType = {
    setLocale: (locale: string) => void;
    setContainerLocale: (locale: string) => void;
    getLocale: () => string;
    locale: string;
    containerLocale: string;
};

export function useUserLocale(): UserLocaleType {
    const [, setValue] = useRecoilState<string>(appUserLocale);
    const setLocale = (locale: string): void => {
        i18n.changeLanguage(locale);
        localStorage.setItem(USER_LOCALE, locale);
        setValue(locale);
    };

    const setContainerLocale = (locale: string): void => {
        localStorage.setItem(CONTAINER_LOCALE, locale);
    };

    const locale =
        localStorage.getItem(USER_LOCALE) ||
        localStorage.getItem(CONTAINER_LOCALE) ||
        "en";
    setValue(locale);
    const containerLocale = localStorage.getItem(CONTAINER_LOCALE) || "en";

    const getLocale = (): string => {
        return localStorage.getItem(USER_LOCALE) || "";
    };

    return {
        setLocale,
        locale,
        setContainerLocale,
        containerLocale,
        getLocale,
    };
}
