export const getDate = (date: string): string => {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const dt = newDate.getDate();

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
