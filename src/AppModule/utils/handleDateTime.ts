export const getDate = (date: string): string => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const dt = newDate.getDate();

    return `${year}-${month}-${dt}`;
};

export const getTomorrow = (date: string): string => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const dt = newDate.getDate() + 1;

    return `${year}-${month}-${dt}`;
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
    const time = `${newDate.getHours()}:${newDate.getMinutes()}:00`;

    return time;
};

export const getFullDate = (date: string): string => {
    return `${getDate(date)} ${getTime24(date)}`;
};

export const getTomorrowDate = (date: string): string => {
    return `${getTomorrow(date)} 00:00:00`;
};
