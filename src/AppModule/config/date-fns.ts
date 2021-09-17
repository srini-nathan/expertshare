import type { Localize, LocalizeFn, QuarterIndex } from "date-fns/locale/types";
import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";
import { enUS } from "date-fns/locale";
import { registerLocale } from "react-datepicker";

let locale: Locale = { ...enUS };
export const init = (t: (key: string) => string) => {

    const eraValues = {
        narrow: ["B", "A"] as const,
        abbreviated: ["BC", "AD"] as const,
        wide: ["Before Christ", "Anno Domini"] as const,
    };

    const quarterValues = {
        narrow: ["1", "2", "3", "4"] as const,
        abbreviated: ["Q1", "Q2", "Q3", "Q4"] as const,
        wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"] as const,
    };

    // Note: in English, the names of days of the week and months are capitalized.
    // If you are making a new locale based on this one, check if the same is true for the language you're working on.
    // Generally, formatted dates should look like they are in the middle of a sentence,
    // e.g. in Spanish language the weekdays and months should be in the lowercase.
    const monthValues = {
        narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] as const,
        abbreviated: [
            t("common.date:abbreviated.month.jan"),
            t("common.date:abbreviated.month.feb"),
            t("common.date:abbreviated.month.mar"),
            t("common.date:abbreviated.month.apr"),
            t("common.date:abbreviated.month.may"),
            t("common.date:abbreviated.month.jun"),
            t("common.date:abbreviated.month.jul"),
            t("common.date:abbreviated.month.aug"),
            t("common.date:abbreviated.month.sep"),
            t("common.date:abbreviated.month.oct"),
            t("common.date:abbreviated.month.nov"),
            t("common.date:abbreviated.month.dec"),
        ] as const,
        wide: [
            t("common.date:wide.month.january"),
            t("common.date:wide.month.february"),
            t("common.date:wide.month.march"),
            t("common.date:wide.month.april"),
            t("common.date:wide.month.may"),
            t("common.date:wide.month.june"),
            t("common.date:wide.month.july"),
            t("common.date:wide.month.august"),
            t("common.date:wide.month.september"),
            t("common.date:wide.month.october"),
            t("common.date:wide.month.november"),
            t("common.date:wide.month.december"),
        ] as const,
    };

    const dayValues = {
        narrow: [
            t("common.date:narrow.day.s"),
            t("common.date:narrow.day.m"),
            t("common.date:narrow.day.t"),
            t("common.date:narrow.day.w"),
            t("common.date:narrow.day.t"),
            t("common.date:narrow.day.f"),
            t("common.date:narrow.day.s")
        ] as const,
        short: [
            t("common.date:short.day.su"),
            t("common.date:short.day.mo"),
            t("common.date:short.day.tu"),
            t("common.date:short.day.we"),
            t("common.date:short.day.th"),
            t("common.date:short.day.fr"),
            t("common.date:short.day.sa")
        ] as const,
        abbreviated: [
            t("common.date:abbreviated.day.sun"),
            t("common.date:abbreviated.day.mon"),
            t("common.date:abbreviated.day.tue"),
            t("common.date:abbreviated.day.wed"),
            t("common.date:abbreviated.day.thu"),
            t("common.date:abbreviated.day.fri"),
            t("common.date:abbreviated.day.sat"),
        ] as const,
        wide: [
            t("common.date:wide.day.sunday"),
            t("common.date:wide.day.monday"),
            t("common.date:wide.day.tuesday"),
            t("common.date:wide.day.wednesday"),
            t("common.date:wide.day.thursday"),
            t("common.date:wide.day.friday"),
            t("common.date:wide.day.saturday"),
        ] as const,
    };

    const dayPeriodValues = {
        narrow: {
            am: "a",
            pm: "p",
            midnight: "mi",
            noon: "n",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night",
        },
        abbreviated: {
            am: "AM",
            pm: "PM",
            midnight: "midnight",
            noon: "noon",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night",
        },
        wide: {
            am: "a.m.",
            pm: "p.m.",
            midnight: "midnight",
            noon: "noon",
            morning: "morning",
            afternoon: "afternoon",
            evening: "evening",
            night: "night",
        },
    };

    const formattingDayPeriodValues = {
        narrow: {
            am: "a",
            pm: "p",
            midnight: "mi",
            noon: "n",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night",
        },
        abbreviated: {
            am: "AM",
            pm: "PM",
            midnight: "midnight",
            noon: "noon",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night",
        },
        wide: {
            am: "a.m.",
            pm: "p.m.",
            midnight: "midnight",
            noon: "noon",
            morning: "in the morning",
            afternoon: "in the afternoon",
            evening: "in the evening",
            night: "at night",
        },
    };

    const ordinalNumber: LocalizeFn<number, undefined> = (
        dirtyNumber,
        _options,
    ) => {
        const number = Number(dirtyNumber);

        // If ordinal numbers depend on context, for example,
        // if they are different for different grammatical genders,
        // use `options.unit`.
        //
        // `unit` can be 'year', 'quarter', 'month', 'week', 'date', 'dayOfYear',
        // 'day', 'hour', 'minute', 'second'.

        const rem100 = number % 100;
        if (rem100 > 20 || rem100 < 10) {
            switch (rem100 % 10) {
                case 1:
                    return number + "st";
                case 2:
                    return number + "nd";
                case 3:
                    return number + "rd";
            }
        }
        return number + "th";
    };

    const localize: Localize = {
        ordinalNumber,

        era: buildLocalizeFn({
            values: eraValues,
            defaultWidth: "wide",
        }),

        quarter: buildLocalizeFn({
            values: quarterValues,
            defaultWidth: "wide",
            argumentCallback: (quarter) => (quarter - 1) as QuarterIndex,
        }),

        month: buildLocalizeFn({
            values: monthValues,
            defaultWidth: "wide",
        }),

        day: buildLocalizeFn({
            values: dayValues,
            defaultWidth: "wide",
        }),

        dayPeriod: buildLocalizeFn({
            values: dayPeriodValues,
            defaultWidth: "wide",
            formattingValues: formattingDayPeriodValues,
            defaultFormattingWidth: "wide",
        }),
    };

    locale = {
        ...locale,
        localize,
    };
};

export {
    locale,
};