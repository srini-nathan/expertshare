export abstract class AcceptableResponse {
    public static JSON = "JSON";

    public static HYDRA = "HYDRA";

    public static REQUEST_ACCEPT_HEADERS = {
        [AcceptableResponse.JSON]: "application/json",
        [AcceptableResponse.HYDRA]: "application/ld+json",
    };

    public static header = (type: string): string => {
        if (!AcceptableResponse.REQUEST_ACCEPT_HEADERS[type]) {
            throw new Error(
                "Unknown response type passed, that is not acceptable."
            );
        }
        return AcceptableResponse.REQUEST_ACCEPT_HEADERS[type];
    };
}
