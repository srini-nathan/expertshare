import { AppGridPageSizeOption } from "../../../AppModule/models";
import { appGridConfig } from "../../../AppModule/config";

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
