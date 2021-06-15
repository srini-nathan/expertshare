export type RequestParamsType = QueryParams | URLSearchParams;
export type RequestPayloadDataType = RequestParamsType | FormData;

export interface QueryParams {
    [param: string]: string | boolean | number | null;
}
