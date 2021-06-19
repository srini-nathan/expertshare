import { parse, format } from "date-fns";
import { useGlobalData } from "../contexts/GlobalContext";

type DateTimeType = {
    parse: (date: string, format: string) => Date;
    toShortDate: (date: Date) => string;
    toShortTime: (date: Date) => string;
};

export function useDateTime(): DateTimeType {
    const { container } = useGlobalData();
    if (!container) {
        throw new Error("GlobalData is not initialized");
    }
    const { configuration } = container;
    const { shortTime, shortDate } = configuration as any;

    const toShortDate = (date: Date): string => {
        return format(date, shortDate || "EEEE MMMM, dd");
    };

    const toShortTime = (date: Date): string => {
        return format(date, shortTime || "hh:mm a");
    };

    const parseDate = (date: string, dateFormat: string): Date => {
        return parse(date, dateFormat, new Date());
    };

    return {
        parse: parseDate,
        toShortDate,
        toShortTime,
    };
}
