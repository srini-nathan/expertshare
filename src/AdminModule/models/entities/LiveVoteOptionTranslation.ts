export class LiveVoteOptionTranslation {
    locale: string;

    name: string;

    description: string;

    constructor(locale: string, name = "", description = "") {
        this.locale = locale;
        this.name = name;
        this.description = description;
    }
}
