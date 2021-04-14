export const randomAlphaNumeric = (max = 6): string => {
    return Math.random().toString(36).substring(max);
};
