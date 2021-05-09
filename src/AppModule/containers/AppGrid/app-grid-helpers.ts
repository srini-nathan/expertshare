import { IServerSideGetRowsRequest } from "ag-grid-community";
import {
    AppGridFilterModel,
    AppGridPageSizeOption,
    AppGridSortModel,
    PrimitiveObject,
    SimpleObject,
} from "../../models";
import { appGridConfig } from "../../config";

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

export const pageSizeOptions = (): AppGridPageSizeOption[] => [
    {
        label: 10,
        value: 10,
    },
    {
        label: 20,
        value: 20,
    },
    {
        label: 30,
        value: 30,
    },
    {
        label: 50,
        value: 50,
    },
    {
        label: 100,
        value: 100,
    },
];

export const defaultPageSize = (): AppGridPageSizeOption => {
    return { label: appGridConfig.pageSize, value: appGridConfig.pageSize };
};
