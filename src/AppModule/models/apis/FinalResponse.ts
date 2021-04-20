import { isString as _isString } from "lodash";
import { ErrorResponse } from "./ErrorResponse";
import { EntityNotFoundErrorResponse } from "./EntityNotFoundErrorResponse";
import { UnprocessableEntityErrorResponse } from "./UnprocessableEntityErrorResponse";

type ErrorType = null | string | ErrorResponse;

export class FinalResponse<R> {
    response: null | R;

    error: ErrorType;

    // to handle 404,
    // if the entity doesn't exist, while fetching or deleting an entity,
    isNotFound = false;

    // to handle 422,
    // if the entity is not valid or violation occurred, while creating or updating an entity,
    isInvalid = false;

    errorMessage = "";

    constructor(response: R | null = null, error: ErrorType = null) {
        this.error = error;
        this.response = response;

        if (error instanceof EntityNotFoundErrorResponse) {
            this.isNotFound = true;
        }

        if (error instanceof UnprocessableEntityErrorResponse) {
            this.isInvalid = true;
        }

        if (error !== null) {
            if (_isString(error)) {
                this.errorMessage = error;
            }

            if (error instanceof ErrorResponse) {
                this.errorMessage = error.description;
            }
        }
    }
}
