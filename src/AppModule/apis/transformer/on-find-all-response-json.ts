import { ListResponse, SimpleObject } from "../../models";
import { checkAndParseResponse } from "../../utils";

export const onFindAllResponseJson = <T>(
    data: string | SimpleObject<any>
): ListResponse<T> => {
    const parsedData: any = checkAndParseResponse(data);
    return new ListResponse<T>(parsedData);
};
