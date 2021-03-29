import { ListResponse } from "../../models";

export const onFindAllResponseJson = <T>(
    data: { [key: string]: any } | [{ [key: string]: any }] | any
) => {
    const parsedData: T[] = JSON.parse(data);
    return new ListResponse<T>(parsedData);
};
