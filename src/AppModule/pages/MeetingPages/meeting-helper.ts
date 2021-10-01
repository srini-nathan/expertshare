import { SimpleObject } from "../../models/SimpleObject";
import { MEETING_PROVIDER, MEETING_TYPE } from "../../../config";

const MINUTE_MULTIPLIER = 5;

export const getProviderOptions = (
    t: (key: string) => string
): SimpleObject<string>[] => {
    return [
        {
            value: MEETING_PROVIDER.PROVIDER_MEET,
            label: t("meeting.form:provider.option.meet"),
        },
        {
            value: MEETING_PROVIDER.PROVIDER_WEBEX,
            label: t("meeting.form:provider.option.webx"),
        },
        {
            value: MEETING_PROVIDER.PROVIDER_ZOOM,
            label: t("meeting.form:provider.option.zoom"),
        },
    ];
};

export const getTypeOptions = (
    t: (key: string) => string
): SimpleObject<string | number>[] => {
    return [
        {
            label: t("meeting.form:type.option.single"),
            value: MEETING_TYPE.TYPE_SINGLE,
        },
        {
            label: t("meeting.form:type.option.repeatWeekly"),
            value: MEETING_TYPE.TYPE_REPEAT_WEEKLY,
        },
        {
            label: t("meeting.form:type.option.repeatCustom"),
            value: MEETING_TYPE.TYPE_REPEAT_CUSTOM,
        },
    ];
};

export const getIntervalOptions = (
    t: (key: string) => string
): SimpleObject<string>[] => {
    const options: SimpleObject<string>[] = [];
    for (let i = 1; i <= 12; i++) {
        const value = `${i * MINUTE_MULTIPLIER}`;
        options.push({
            value,
            label: `${value} ${t("common.date:wide.minutes")}`,
        });
    }

    return options;
};
