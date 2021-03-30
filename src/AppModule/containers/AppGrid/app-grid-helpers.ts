import { IServerSideGetRowsRequest } from "ag-grid-community";
import { AppGridSortModel, SimpleObject } from "../../models";

export const buildSortParams = (
    request: IServerSideGetRowsRequest
): SimpleObject<string> => {
    const sortModel = request.sortModel as AppGridSortModel[];
    const orderParams: SimpleObject<string> = {};

    const putOrder = (key: string, val: string): void => {
        orderParams[key] = val;
    };

    if (sortModel) {
        sortModel.forEach((sort) => {
            putOrder(sort.colId, sort.sort);
        });
    }

    return orderParams;
};
