import { BaseEntity } from "../../../AppModule/models";

export class LiveVoteOptionTranslation extends BaseEntity {
    locale: string;

    title: string;

    description: string;

    constructor(
        locale: string,
        name = "",
        description = "",
        { id, createdAt, updatedAt }: PLiveVoteOptionTranslation = {}
    ) {
        super(id, createdAt, updatedAt);
        this.locale = locale;
        this.title = name;
        this.description = description;
    }

    static createFrom(locale: string): LiveVoteOptionTranslation {
        return new LiveVoteOptionTranslation(locale);
    }
}

export type PLiveVoteOptionTranslation = Partial<LiveVoteOptionTranslation>;
