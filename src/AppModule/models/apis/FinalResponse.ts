import { ErrorResponse } from "./ErrorResponse";

type ErrorType = null | string | ErrorResponse;

export class FinalResponse<R> {
    response: R | null;

    error: ErrorType;

    constructor(response: R | null = null, error: ErrorType = null) {
        this.error = error;
        this.response = response;
    }
}
