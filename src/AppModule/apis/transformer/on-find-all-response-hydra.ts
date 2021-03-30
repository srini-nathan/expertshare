import { ListResponse } from "../../models";

export const onFindAllResponseHydra = <T>(data: string): ListResponse<T> => {
    const listResponse = new ListResponse<T>();
    const parsedData = JSON.parse(data);

    if (parsedData["hydra:member"]) {
        listResponse.items = parsedData["hydra:member"];
    }
    if (parsedData["hydra:totalItems"]) {
        listResponse.totalItems = parsedData["hydra:totalItems"];
    }

    return listResponse;
};
