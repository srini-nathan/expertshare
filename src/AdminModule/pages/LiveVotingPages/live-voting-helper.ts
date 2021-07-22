import { Option } from "../../../AppModule/models";

export const getTypeOptions = (
    t: (key: string) => string
): Option<string>[] => {
    return [
        {
            label: t("admin.liveVotes.form:option.type.radio"),
            value: "RADIO",
        },
        {
            label: t("admin.liveVotes.form:option.type.checkbox"),
            value: "CHECKBOX",
        },
        {
            label: t("admin.liveVotes.form:option.type.text"),
            value: "TEXT",
        },
    ];
};

export const getChartOptions = (
    t: (key: string) => string
): Option<string>[] => {
    return [
        {
            label: t("admin.liveVotes.form:option.chartType.bar"),
            value: "BAR",
        },
        {
            label: t("admin.liveVotes.form:option.chartType.pie"),
            value: "PIE",
        },
    ];
};
