import { NavigationTranslations } from "./NavigationTranslations";

export const NavigationType = {
    INTERNAL: "INTERNAL",
    INFO_PAGE: "INFO_PAGE",
    EXTERNAL: "EXTERNAL",
};

export class Navigation {
    translations: NavigationTranslations[];

    key: string;

    isActive: boolean;

    ord: number;

    icon: string;

    type: string;

    typeOption: string;

    url: string;

    isOpenInNewWindow: boolean;

    constructor({
        key = "",
        isActive = true,
        ord = 1,
        icon = "",
        type = NavigationType.INTERNAL,
        typeOption = "",
        url = "",
        isOpenInNewWindow = false,
        translations = [],
    }: Partial<Navigation> = {}) {
        this.key = key;
        this.isActive = isActive;
        this.ord = ord;
        this.icon = icon;
        this.type = type;
        this.typeOption = typeOption;
        this.url = url;
        this.isOpenInNewWindow = isOpenInNewWindow;
        this.translations = translations;
    }
}
