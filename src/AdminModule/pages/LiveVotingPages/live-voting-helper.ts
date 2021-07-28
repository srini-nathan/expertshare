import { SimpleObject } from "../../../AppModule/models";

export const getTypeOptions = (
    t: (key: string) => string
): SimpleObject<string | number>[] => {
    return [
        {
            label: t("admin.liveVote.form:option.type.radio"),
            value: "RADIO",
        },
        {
            label: t("admin.liveVote.form:option.type.checkbox"),
            value: "CHECKBOX",
        },
        {
            label: t("admin.liveVote.form:option.type.text"),
            value: "TEXT",
        },
    ];
};

export const getChartOptions = (
    t: (key: string) => string
): SimpleObject<string | number>[] => {
    return [
        {
            label: t("admin.liveVote.form:option.chartType.bar"),
            value: "BAR",
        },
        {
            label: t("admin.liveVote.form:option.chartType.pie"),
            value: "PIE",
        },
    ];
};
