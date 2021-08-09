export class LiveVoteOptionTranslation {
    locale: string;

    title: string;

    description: string;

    constructor(locale: string, name = "", description = "") {
        this.locale = locale;
        this.title = name;
        this.description = description;
    }

    static createFrom(locale: string): LiveVoteOptionTranslation {
        return new LiveVoteOptionTranslation(locale);
    }
}
