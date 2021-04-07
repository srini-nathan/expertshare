import { ErrorResponse } from "../../models/apis/ErrorResponse";

export const onDeleteErrorResponseHydra = (data: string): ErrorResponse => {
    const errorResponse = new ErrorResponse("", "");
    const parseData = JSON.parse(data);
    if (parseData["hydra:description"]) {
        errorResponse.description = parseData["hydra:description"];
    }
    if (parseData["hydra:title"]) {
        errorResponse.title = parseData["hydra:title"];
    }
    return errorResponse;
};
