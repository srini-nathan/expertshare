export class ErrorResponse {
    title = "Something went wrong!";

    description = "Unable to process your request, please try again!";

    constructor(
        title: string | null = null,
        description: string | null = null
    ) {
        if (title) {
            this.title = title;
        }
        if (description) {
            this.description = description;
        }
    }
}
