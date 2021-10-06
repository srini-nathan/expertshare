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

export const getDays = (t: (key: string) => string): SimpleObject<string>[] => {
    return [
        { value: "1", label: t("common.date:wide.day.monday") },
        { value: "2", label: t("common.date:wide.day.tuesday") },
        { value: "3", label: t("common.date:wide.day.wednesday") },
        { value: "4", label: t("common.date:wide.day.thursday") },
        { value: "5", label: t("common.date:wide.day.friday") },
        { value: "6", label: t("common.date:wide.day.saturday") },
        { value: "7", label: t("common.date:wide.day.sunday") },
    ];
};

export const getTime = (interval = 30): SimpleObject<string>[] => {
    const options: SimpleObject<string>[] = [];
    for (let i = 0; i <= 24; i++) {
        for (let k = 0; k < 60; k += interval) {
            if (!(i === 24 && k > 0)) {
                const hours = i > 9 ? `${i}` : `0${i}`;
                const minutes = k > 9 ? `${k}` : `0${k}`;
                options.push({
                    value: `${hours}${minutes}`,
                    label: `${hours}:${minutes}`,
                });
            }
        }
    }
    return options;
};

export const storableTime = (time: string): string => {
    // eslint-disable-next-line no-console
    console.log(time, "time");
    if (time.length === 3) {
        const split = time.split("");
        return `0${split[0]}:${split[1]}${split[2]}`;
    }

    if (time.length === 4) {
        const split = time.split("");
        return `${split[0]}${split[1]}:${split[2]}${split[3]}`;
    }

    return `00:${time}`;
};
