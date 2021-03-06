// noinspection SpellCheckingInspection
const randomCharSet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789=";

export const randomAlphaNumeric = (max = 6): string => {
    let result = "";
    const charactersLength = randomCharSet.length;
    for (let i = 0; i < max; i += 1) {
        result += randomCharSet.charAt(
            Math.floor(Math.random() * charactersLength)
        );
    }

    return result;
};

export const randomInteger = (): number => {
    return (
        Math.floor(Math.random() * 10000 + 1000) *
        Math.floor(Math.random() * 10000 + 1000)
    );
};

export const getRandomId = (): number => {
    const min = Math.ceil(0);
    const max = Math.floor(new Date().getTime());
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
