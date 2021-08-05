import { LiveVoteQuestionTranslation } from "./LiveVoteQuestionTranslation";
import { LiveVoteOption } from "./LiveVoteOption";
import { Session } from "./Session";
import { BaseEntity } from "../../../AppModule/models/entities/BaseEntity";
import { Container } from "./Container";
import { VOTE_QUESTION_TYPE, VOTE_QUESTION_CHART_TYPE } from "../../../config";
import { SimpleObject } from "../../../AppModule/models";

export type SLiveVoteQuestionTranslation = SimpleObject<LiveVoteQuestionTranslation>;

export class LiveVoteQuestion extends BaseEntity {
    name: string;

    type: string;

    chartType: string;

    session: string | Session;

    container: string | Container;

    voteOptions: LiveVoteOption[];

    translations: LiveVoteQuestionTranslation[] | SLiveVoteQuestionTranslation;

    minOptionSelect: number;

    maxOptionSelect: number;

    isSelected: boolean;

    isResultPublished: boolean;

    constructor(
        container: string,
        session: string,
        {
            name = "",
            type = VOTE_QUESTION_TYPE.VOTEQUESTIONTYPE_RADIO,
            chartType = VOTE_QUESTION_CHART_TYPE.VOTEQUESTIONCHARTTYPE_BAR,
            voteOptions = [LiveVoteOption.createFrom()],
            translations = [],
            maxOptionSelect = 0,
            minOptionSelect = 0,
            isSelected = false,
            isResultPublished = false,
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
        this.minOptionSelect = minOptionSelect;
        this.maxOptionSelect = maxOptionSelect;
        this.isResultPublished = isResultPublished;
        this.isSelected = isSelected;
    }
}
