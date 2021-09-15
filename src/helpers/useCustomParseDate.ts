import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import buildLocalizeFn from "date-fns/locale/_lib/buildLocalizeFn";

type CustomParseDate = {
    customParse: (date: Date, dateFormat: string) => string;
};

const monthValues = {
    narrow: [
        "date.month.narrow:J",
        "date.month.narrow:F",
        "date.month.narrow:M",
        "date.month.narrow:A",
        "date.month.narrow:M",
        "date.month.narrow:J",
        "date.month.narrow:J",
        "date.month.narrow:A",
        "date.month.narrow:S",
        "date.month.narrow:O",
        "date.month.narrow:N",
        "date.month.narrow:D",
    ],
    abbreviated: [
        "date.month.abbr:Jan",
        "date.month.abbr:Feb",
        "date.month.abbr:Mar",
        "date.month.abbr:Apr",
        "date.month.abbr:May",
        "date.month.abbr:Jun",
        "date.month.abbr:Jul",
        "date.month.abbr:Aug",
        "date.month.abbr:Sep",
        "date.month.abbr:Oct",
        "date.month.abbr:Nov",
        "date.month.abbr:Dec",
    ],
    wide: [
        "date.month.wide:January",
        "date.month.wide:February",
        "date.month.wide:March",
        "date.month.wide:April",
        "date.month.wide:May",
        "date.month.wide:June",
        "date.month.wide:July",
        "date.month.wide:August",
        "date.month.wide:September",
        "date.month.wide:October",
        "date.month.wide:November",
        "date.month.wide:December",
    ],
};
const dayValues = {
    narrow: [
        "date.day.narrow:S",
        "date.day.narrow:M",
        "date.day.narrow:T",
        "date.day.narrow:W",
        "date.day.narrow:T",
        "date.day.narrow:F",
        "date.day.narrow:S",
    ],
    short: [
        "date.day.short:Su",
        "date.day.short:Mo",
        "date.day.short:Tu",
        "date.day.short:We",
        "date.day.short:Th",
        "date.day.short:Fr",
        "date.day.short:Sa",
    ],
    abbreviated: [
        "date.day.abbr:Sun",
        "date.day.abbr:Mon",
        "date.day.abbr:Tue",
        "date.day.abbr:Wed",
        "date.day.abbr:Thu",
        "date.day.abbr:Fri",
        "date.day.abbr:Sat",
    ],
    wide: [
        "date.day.wide:Sunday",
        "date.day.wide:Monday",
        "date.day.wide:Tuesday",
        "date.day.wide:Wednesday",
        "date.day.wide:Thursday",
        "date.day.wide:Friday",
        "date.day.wide:Saturday",
    ],
};

const locale = {
    ...enUS,
    localize: {
        ...enUS.localize,
        month: buildLocalizeFn({
            values: monthValues,
            defaultWidth: "wide",
        }),
        day: buildLocalizeFn({
            values: dayValues,
            defaultWidth: "wide",
        }),
    },
};

export function useCustomParseDate(): CustomParseDate {
    const customParse = (date: Date, dateFormat: string): string => {
        return format(date, dateFormat, { locale: locale as Locale });
    };

    return {
        customParse,
    };
}
