import { parse } from "date-fns";
import { useGlobalData } from "../contexts/GlobalContext";
import { parseConfiguration, humanReadableDate } from "../utils";

type DateTimeType = {
    parse: (date: string, format: string) => Date;
    toShortDate: (date: Date) => string;
    toShortTime: (date: Date) => string;
    toLongDate: (date: Date) => string;
    toLongTime: (date: Date) => string;
    toLongDateTime: (date: Date) => string;
    toShortDateTime: (date: Date) => string;
};

export function useDateTime(): DateTimeType {
    const { container } = useGlobalData();
    if (!container) {
        throw new Error("GlobalData is not initialized");
    }
    const configuration = parseConfiguration(container);
    const {
        shortTime,
        shortDate,
        longDate,
        longTime,
        shortDatetime,
        longDatetime,
    } = configuration;

    const toShortDate = (date: Date): string => {
        return humanReadableDate(date, shortDate);
    };

    const toShortTime = (date: Date): string => {
        return humanReadableDate(date, shortTime);
    };

    const toLongDate = (date: Date): string => {
        return humanReadableDate(date, longDate);
    };

    const toLongTime = (date: Date): string => {
        return humanReadableDate(date, longTime);
    };

    const toLongDateTime = (date: Date): string => {
        return humanReadableDate(date, longDatetime);
    };

    const toShortDateTime = (date: Date): string => {
        return humanReadableDate(date, shortDatetime);
    };

    const parseDate = (date: string, dateFormat: string): Date => {
        return parse(date, dateFormat, new Date());
    };

    return {
        parse: parseDate,
        toShortDate,
        toShortTime,
        toLongDate,
        toLongTime,
        toLongDateTime,
        toShortDateTime,
    };
}
