export const response = (
    data: { [key: string]: any } | [{ [key: string]: any }] | any,
    headers: string[]
) => {
    // eslint-disable-next-line no-console
    console.log("transformer", data, headers);
    return data;
};
