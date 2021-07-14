export class NavigationTranslations {
    locale: string;

    title: string;

    constructor(
        locale: string,
        { title = "" }: Partial<NavigationTranslations> = {}
    ) {
        this.locale = locale;
        this.title = title;
    }
}
