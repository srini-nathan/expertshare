import { SimpleObject, UnprocessableEntityErrorResponse } from "../../models";
import { checkAndParseResponse } from "../../utils";

export const onAddEditErrorResponseHydra = (
    data: string | SimpleObject<any>
): UnprocessableEntityErrorResponse => {
    const errorResponse = new UnprocessableEntityErrorResponse();
    const parsedData: SimpleObject<any> = checkAndParseResponse(data);

    if (parsedData["hydra:title"]) {
        errorResponse.title = parsedData["hydra:title"];
    }

    if (parsedData["hydra:description"]) {
        errorResponse.description = parsedData["hydra:description"];
    }

    if (parsedData.violations) {
        errorResponse.setViolations(parsedData.violations);
    }

    return errorResponse;
};
