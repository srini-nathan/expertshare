import { LANGUAGES } from "../config/app-env";
import { Language } from "../../AdminModule/models";

export function useLanguages() {
    const Languages = (): Language[] => {
        const language = localStorage.getItem(LANGUAGES);
        if (language) {
            return JSON.parse(language);
        }
        return [];
    };

    return { Languages };
}
