export class InfoPageTranslations {
    locale: string;

    title: string;

    description: string;

    constructor(
        locale: string,
        { title = "", description = "" }: Partial<InfoPageTranslations> = {}
    ) {
        this.locale = locale;
        this.title = title;
        this.description = description;
    }
}
