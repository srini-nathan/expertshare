import { ListResponse } from "../../models";

export const onFindAllResponseJson = <T>(data: string): ListResponse<T> => {
    const parsedData: T[] = JSON.parse(data);
    return new ListResponse<T>(parsedData);
};
