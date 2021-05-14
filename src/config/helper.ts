import { PrimitiveObject } from "../AppModule/models";

export const route = (path: string, routeParams: PrimitiveObject) => {
    if (!routeParams) {
        return path;
    }
    let url = path;
    const params = Object.keys(routeParams);
    params.forEach((param) => {
        const value = routeParams[param];
        url = url.replace(`{${param}}`, `${value}`);
    });
    return url;
};
