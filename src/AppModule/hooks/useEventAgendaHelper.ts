import {
    isToday,
    format as toString,
    isPast,
    isFuture,
    closestTo,
} from "date-fns";
import { useDateTime } from "./useDateTime";

type EventAgendaHelperType = {
    selectActiveDate: (dates: string[], format: string) => string | null;
};

export function useEventAgendaHelper(): EventAgendaHelperType {
    const { parse } = useDateTime();
    const selectActiveDate = (
        dates: string[],
        format: string
    ): string | null => {
        let today: any = null;
        let closedToToday: any = null;
        const futureDates: Date[] = [];
        const pastDates: Date[] = [];
        dates.forEach((dt) => {
            const d = parse(dt, format);
            if (isToday(d)) {
                today = d;
            }
            if (isPast(d)) {
                pastDates.push(d);
            }
            if (isFuture(d)) {
                futureDates.push(d);
            }
        });

        if (today !== null) {
            closedToToday = today;
        } else if (futureDates.length > 0) {
            // @TODO: Instead of browser new Date(), we can initialize Date object from server time string and use object everywhere
            closedToToday = closestTo(new Date(), futureDates);
        } else if (pastDates.length > 0) {
            // @TODO: Instead of browser new Date(), we can initialize Date object from server time string and use object everywhere
            closedToToday = closestTo(new Date(), pastDates);
        }

        if (closedToToday !== null) {
            return toString(closedToToday, format);
        }

        return null;
    };

    return {
        selectActiveDate,
    };
}
