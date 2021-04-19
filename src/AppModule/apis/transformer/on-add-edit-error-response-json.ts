import { UnprocessableEntityErrorResponse } from "../../models";

export const onAddEditErrorResponseJson = (
    data: string
): UnprocessableEntityErrorResponse => {
    const errorResponse = new UnprocessableEntityErrorResponse();
    const parseData = JSON.parse(data);

    if (parseData.title) {
        errorResponse.title = parseData.title;
    }

    if (parseData.detail) {
        errorResponse.description = parseData.detail;
    }

    if (parseData.violations) {
        errorResponse.setViolations(parseData.violations);
    }

    return errorResponse;
};
