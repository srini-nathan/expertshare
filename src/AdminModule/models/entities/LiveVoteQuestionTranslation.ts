export class LiveVoteQuestionTranslation {
    locale: string;

    title: string;

    constructor(locale: string, title = "") {
        this.locale = locale;
        this.title = title;
    }

    static createFrom(locale: string): LiveVoteQuestionTranslation {
        return new LiveVoteQuestionTranslation(locale);
    }
}
