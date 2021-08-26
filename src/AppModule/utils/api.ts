import { forEach as _forEach, isString as _isString } from "lodash";
import { UseFormSetError } from "react-hook-form/dist/types/form";
import { Canceler } from "axios";
import { randomAlphaNumeric } from "./random";
import { SimpleObject, UnprocessableEntityErrorResponse } from "../models";

export const generateKeyHeader = (saltLen = 6): string => {
    const { location } = window;
    const { host } = location;
    const hostBase64 = btoa(host);
    const prefixSalt = randomAlphaNumeric(saltLen);
    const suffixSalt = randomAlphaNumeric(saltLen);

    return `${prefixSalt}${hostBase64}${suffixSalt}`;
};

// @TODO: use from handleDateTime file, remove duplicate
export const getUserTimeZone = (): string => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
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

export const setViolations = <T>(
    error: UnprocessableEntityErrorResponse,
    setError: UseFormSetError<T>
) => {
    const { violations } = error;
    _forEach(violations, (value: string, key: string) => {
        setError(key as never, {
            type: "backend",
            message: value,
        });
    });
};

export const cancelAllPrevRequest = (cancelTokenSources: Canceler[]) => {
    while (cancelTokenSources.length > 0) {
        const c = cancelTokenSources.shift();
        if (c) {
            c();
        }
    }
};
