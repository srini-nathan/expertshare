import { randomAlphaNumeric } from "./random";

export const generateKeyHeader = (saltLen = 6): string => {
    const { location } = window;
    const { host } = location;
    const hostBase64 = btoa(host);
    const prefixSalt = randomAlphaNumeric(saltLen);
    const suffixSalt = randomAlphaNumeric(saltLen);

    return `${prefixSalt}${hostBase64}${suffixSalt}`;
};
