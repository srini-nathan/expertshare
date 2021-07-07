export class ServerError extends Error {
    constructor(error = "Something went wrong!") {
        super(error);
    }
}
