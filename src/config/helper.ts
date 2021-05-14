import { PrimitiveObject } from "../AppModule/models";

export const route = (path: string, routeParams?: PrimitiveObject) => {
    if (!routeParams) {
        return path;
    }
    const params = Object.keys(routeParams);
    params.forEach((param) => {
        const value = routeParams[param];
        path.replace(`{${param}}`, `${value}`);
    });
    return path;
};
