export class LiveVoteOptionTranslation {
    locale: string;

    title: string;

    description: string;

    constructor(locale: string, name = "", description = "") {
        this.locale = locale;
        this.title = name;
        this.description = description;
    }
}
