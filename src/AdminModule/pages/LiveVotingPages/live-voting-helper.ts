import { SimpleObject } from "../../../AppModule/models";
import { VOTE_QUESTION_CHART_TYPE, VOTE_QUESTION_TYPE } from "../../../config";

export const getTypeOptions = (
    t: (key: string) => string
): SimpleObject<string | number>[] => {
    return [
        {
            label: t("admin.liveVote.form:option.type.radio"),
            value: VOTE_QUESTION_TYPE.VOTEQUESTIONTYPE_RADIO,
        },
        {
            label: t("admin.liveVote.form:option.type.checkbox"),
            value: VOTE_QUESTION_TYPE.VOTEQUESTIONTYPE_CHECKBOX,
        },
        {
            label: t("admin.liveVote.form:option.type.text"),
            value: VOTE_QUESTION_TYPE.VOTEQUESTIONTYPE_TEXT,
        },
    ];
};

export const getChartOptions = (
    t: (key: string) => string
): SimpleObject<string | number>[] => {
    return [
        {
            label: t("admin.liveVote.form:option.chartType.bar"),
            value: VOTE_QUESTION_CHART_TYPE.VOTEQUESTIONCHARTTYPE_BAR,
        },
        {
            label: t("admin.liveVote.form:option.chartType.pie"),
            value: VOTE_QUESTION_CHART_TYPE.VOTEQUESTIONCHARTTYPE_PIE,
        },
    ];
};
