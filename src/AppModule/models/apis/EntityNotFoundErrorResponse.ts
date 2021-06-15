import { ErrorResponse } from "./ErrorResponse";

export class EntityNotFoundErrorResponse extends ErrorResponse {
    title = "An error occurred";

    description = "Unable to find your entity, please try again!";
}
