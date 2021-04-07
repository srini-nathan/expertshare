import { SimpleObject } from "../../models";

export const onUpdateRequestHydra = <T>(
    data: T,
    headers: SimpleObject<string>
): T => {
    // eslint-disable-next-line no-param-reassign
    headers["Content-Type"] = "application/merge-patch+json";
    return data;
};
