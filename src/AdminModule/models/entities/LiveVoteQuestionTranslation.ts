import { BaseEntity } from "../../../AppModule/models";

export class LiveVoteQuestionTranslation extends BaseEntity {
    locale: string;

    title: string;

    constructor(
        locale: string,
        title = "",
        { id, createdAt, updatedAt }: PLiveVoteQuestionTranslation = {}
    ) {
        super(id, createdAt, updatedAt);
        this.locale = locale;
        this.title = title;
    }

    static createFrom(locale: string): LiveVoteQuestionTranslation {
        return new LiveVoteQuestionTranslation(locale);
    }
}

export type PLiveVoteQuestionTranslation = Partial<LiveVoteQuestionTranslation>;
