import { zonedTimeToUtc, utcToZonedTime } from "date-fns-tz";
import { addDays, format } from "date-fns";

export const getDate = (date: string): string => {
    return format(new Date(date), "yyyy-MM-dd");
};

export const getTomorrow = (date: string): string => {
    return format(addDays(new Date(date), 1), "yyyy-MM-dd");
};

export const getDateFormat = (date: string) => {
    const newDate = new Date(date);
    const options = {
        weekday: "long",
        month: "long",
        day: "2-digit",
    } as const;
    return newDate.toLocaleDateString("en-US", options);
};

export const getTime = (date: string): string => {
    const newDate = new Date(date);
    const time =
        newDate.getHours() > 12
            ? `${newDate.getHours() - 12}:${newDate.getMinutes()} PM`
            : `${newDate.getHours()}:${newDate.getMinutes()} AM`;

    return time;
};

export const getTime24 = (date: string): string => {
    const newDate = new Date(date);
    const time = `${format(newDate, "kk:mm")}:00`;

    return time;
};

export const getFullDate = (date: string): string => {
    return `${getDate(date)} ${getTime24(date)}`;
};
export const getDateTimeWithoutTimezone = (date: string) => {
    let newDateTime = date.split("+");
    if (newDateTime.length > 1) {
        return new Date(newDateTime[0]);
    }
    newDateTime = date.split("-");
    if (newDateTime.length > 1) {
        return new Date(
            `${newDateTime[0]}-${newDateTime[1]}-${newDateTime[2]}`
        );
    }

    return new Date(date);
};
export const getDateOnly = (date: string) => {
    const newDateTime = date.split(" ");
    if (newDateTime.length > 1) {
        const newDate = new Date(newDateTime[0]).toLocaleString("en-US", {
            timeZone: "UTC",
        });
        return new Date(newDate);
    }
    return new Date(date);
};
export const getDateOnly = (date: string) => {
    const newDateTime = date.split(" ");
    if (newDateTime.length > 1) {
        return new Date(newDateTime[0]);
    }
    return new Date(date);
};

export const getDateWT = (date: string): string => {
    return format(getDateTimeWithoutTimezone(date), "yyyy-MM-dd");
};

export const getUserTimezone = (date: string, timezone: string): string => {
    if (timezone) {
        const newTimeZone = new Date(date)
            .toLocaleString("en-US", { timeZone: timezone })
            .split(",");
        if (newTimeZone.length > 1) {
            return newTimeZone[0];
        }
    }
    return getDateTimeWithoutTimezone(date).toString();
};

export const getTomorrowDate = (date: string): string => {
    return `${getTomorrow(date)} 00:00:00`;
};

export const getTimeZone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const toUTCDate = (date: Date | number | string): Date => {
    return zonedTimeToUtc(date, getTimeZone());
};

export const toLocalDate = (date: Date | number | string): Date => {
    return utcToZonedTime(date, getTimeZone());
};

export const getUTCDate = (): Date => {
    return new Date(new Date().toISOString());
};
