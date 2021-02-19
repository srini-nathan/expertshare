import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

export const init = (resources: Resource) => {
    i18n.use(initReactI18next).init({
        lng: "fr",
        fallbackLng: "en",
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        resources,
    });
};

export default i18n;
