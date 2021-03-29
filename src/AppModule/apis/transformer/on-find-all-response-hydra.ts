import { ListResponse } from "../../models";

export const onFindAllResponseHydra = <T>(
    data: { [key: string]: any } | [{ [key: string]: any }] | any
) => {
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
