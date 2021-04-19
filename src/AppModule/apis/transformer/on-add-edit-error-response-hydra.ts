import { UnprocessableEntityErrorResponse } from "../../models";

export const onAddEditErrorResponseHydra = (
    data: string
): UnprocessableEntityErrorResponse => {
    const errorResponse = new UnprocessableEntityErrorResponse();
    const parseData = JSON.parse(data);

    if (parseData["hydra:title"]) {
        errorResponse.title = parseData["hydra:title"];
    }

    if (parseData["hydra:description"]) {
        errorResponse.description = parseData["hydra:description"];
    }

    if (parseData.violations) {
        errorResponse.setViolations(parseData.violations);
    }

    return errorResponse;
};
