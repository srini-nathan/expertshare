import { SimpleObject } from "../SimpleObject";
import { ErrorResponse } from "./ErrorResponse";

interface Violation {
    propertyPath: string;
    message: string;
    code: string;
}

export class UnprocessableEntityErrorResponse extends ErrorResponse {
    title = "An error occurred";

    description = "Unable to process your entity, please try again!";

    violations: SimpleObject<string> = {};

    constructor(
        title?: string,
        description?: string,
        violations?: Violation[]
    ) {
        super(title, description);
        if (violations) {
            this.setViolations(violations);
        }
    }

    setViolations(violations: Violation[]) {
        violations.forEach((violation) => {
            this.violations[violation.propertyPath] = violation.message;
        });
    }
}
