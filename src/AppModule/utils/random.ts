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
