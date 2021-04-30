import { IServerSideGetRowsRequest } from "ag-grid-community";
import {
    AppGridFilterModel,
    AppGridSortModel,
    PrimitiveObject,
    SimpleObject,
} from "../../models";

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

export const buildFilterParams = (
    request: IServerSideGetRowsRequest
): PrimitiveObject => {
    const filterModel = request.filterModel as AppGridFilterModel[];
    const filterParams: PrimitiveObject = {};
    const setFilter = (key: string, val: string | number | boolean): void => {
        filterParams[key] = val;
    };

    if (filterModel) {
        Object.entries<AppGridFilterModel>(filterModel).forEach(
            ([rowKey, { filter }]) => {
                setFilter(rowKey, filter);
            }
        );
    }

    return filterParams;
};
