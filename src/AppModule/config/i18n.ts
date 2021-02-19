import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";

export const init = (resources: Resource) => {
    i18n.use(initReactI18next).init({
        lng: "en",
        fallbackLng: "en",
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        defaultNS: "AppModule",
        resources,
    });
};

export default i18n;
