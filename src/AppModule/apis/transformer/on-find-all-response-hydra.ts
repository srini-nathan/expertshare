import { ListResponse, SimpleObject } from "../../models";
import { checkAndParseResponse } from "../../utils";

export const onFindAllResponseHydra = <T>(
    data: string | SimpleObject<any>
): ListResponse<T> => {
    const listResponse = new ListResponse<T>();
    const parsedData: SimpleObject<any> = checkAndParseResponse(data);

    if (parsedData["hydra:member"]) {
        listResponse.items = parsedData["hydra:member"];
    }
    if (parsedData["hydra:totalItems"]) {
        listResponse.totalItems = parsedData["hydra:totalItems"];
    }

    return listResponse;
};
