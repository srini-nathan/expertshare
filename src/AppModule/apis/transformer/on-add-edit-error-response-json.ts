import { SimpleObject, UnprocessableEntityErrorResponse } from "../../models";
import { checkAndParseResponse } from "../../utils";

export const onAddEditErrorResponseJson = (
    data: string | SimpleObject<any>
): UnprocessableEntityErrorResponse => {
    const errorResponse = new UnprocessableEntityErrorResponse();
    const parsedData: SimpleObject<any> = checkAndParseResponse(data);

    if (parsedData.title) {
        errorResponse.title = parsedData.title;
    }

    if (parsedData.detail) {
        errorResponse.description = parsedData.detail;
    }

    if (parsedData.violations) {
        errorResponse.setViolations(parsedData.violations);
    }

    return errorResponse;
};
