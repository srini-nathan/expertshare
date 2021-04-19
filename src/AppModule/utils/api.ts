import { isString as _isString } from "lodash";
import { randomAlphaNumeric } from "./random";
import { SimpleObject } from "../models";

export const generateKeyHeader = (saltLen = 6): string => {
    const { location } = window;
    const { host } = location;
    const hostBase64 = btoa(host);
    const prefixSalt = randomAlphaNumeric(saltLen);
    const suffixSalt = randomAlphaNumeric(saltLen);

    return `${prefixSalt}${hostBase64}${suffixSalt}`;
};

export const checkAndParseResponse = (
    data: string | SimpleObject<any>
): SimpleObject<any> => {
    let parseData: SimpleObject<any> = {};
    if (_isString(data)) {
        try {
            parseData = JSON.parse(data);
        } catch (e) {
            throw new Error("Invalid response");
        }
    } else {
        parseData = data;
    }

    return parseData;
};
