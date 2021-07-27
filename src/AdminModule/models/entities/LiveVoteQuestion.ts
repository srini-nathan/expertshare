import { LiveVoteQuestionTranslation } from "./LiveVoteQuestionTranslation copy";
import { LiveVoteOption } from "./LiveVoteOption";
import { Session } from "./Session";
import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { Container } from "./Container";

export class LiveVoteQuestion extends BaseEntity {
    name: string;

    type: string;

    chartType: string;

    session: string | Session;

    container: string | Container;

    voteOptions: LiveVoteOption[];

    translations: LiveVoteQuestionTranslation[];

    constructor(
        container: string,
        session: string,
        {
            name = "",
            type = "",
            chartType = "",
            voteOptions = [],
            translations = [],
            id,
            createdAt,
            updatedAt,
        }: Partial<LiveVoteQuestion> = {}
    ) {
        super(id, createdAt, updatedAt);
        this.container = container;
        this.session = session;
        this.name = name;
        this.type = type;
        this.chartType = chartType;
        this.voteOptions = voteOptions;
        this.translations = translations;
    }
}
