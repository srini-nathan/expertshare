import { useTranslation } from "react-i18next";
import { MutableRefObject } from "react";
import { isString } from "lodash";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { EntityAPI } from "../apis";
import { errorToast, successToast } from "../utils";
import { SimpleObject } from "../models";
import { appGridConfig } from "../config";
import { LiveVoteQuestionApi } from "../../AdminModule/apis";
import { Language } from "../../AdminModule/models";
import { buildFilterParams, buildSortParams } from "../containers/AppGrid";

type FunctionMetaData = {
    success?: string;
    onSuccess?: <T>(data?: T) => void;
    error?: string;
    onError?: () => void;
    onCleanup?: () => void;
    wantToRefreshOnDelete?: boolean;
};

type BuildDataSourceMetaData = {
    onSuccess?: <T>(data?: T) => void;
    onError?: () => void;
};

type UseCRUDHelperFunctionsType = {
    handleDeleteById: (id: number, metaData?: FunctionMetaData) => void;
    setFilter: (search: string, fieldMap: string[]) => void;
    buildDataSource: (
        qParams?: any,
        cancelTokenSourcesRef?: MutableRefObject<Canceler[]>,
        metaData?: BuildDataSourceMetaData
    ) => IServerSideDatasource;
};

export function useCRUDHelperFunctions(
    emRef: typeof EntityAPI,
    agGridApi?: MutableRefObject<GridApi | undefined>
): UseCRUDHelperFunctionsType {
    const entityManager: typeof EntityAPI = emRef;
    const gridApi = agGridApi;
    const { t } = useTranslation();

    const handleDeleteById = (
        id: number,
        metaData: FunctionMetaData = {}
    ): void => {
        const {
            success,
            error: customErrorMsg,
            onSuccess,
            onError,
            onCleanup,
            wantToRefreshOnDelete = true,
        } = metaData;
        entityManager
            .deleteById(id)
            .then(({ error, errorMessage }) => {
                if (error !== null) {
                    errorToast(t(customErrorMsg || errorMessage));
                    if (onError) {
                        onError();
                    }
                } else {
                    if (success) {
                        successToast(t(success));
                    }
                    if (onSuccess) {
                        onSuccess();
                    }
                    if (gridApi && gridApi.current && wantToRefreshOnDelete) {
                        gridApi.current.refreshServerSideStore({
                            purge: false,
                            route: [],
                        });
                    }
                }
            })
            .catch(() => {
                if (onError) {
                    onError();
                }
            })
            .finally(() => {
                if (onCleanup) {
                    onCleanup();
                }
            });
    };

    const setFilter = (search: string, fieldMap: string[]): void => {
        if (gridApi && gridApi.current) {
            const model: SimpleObject<{ filter: string }> = {};
            fieldMap.forEach((field) => {
                model[field] = {
                    filter: search,
                };
            });
            gridApi.current.setFilterModel(model);
        }
    };

    const buildDataSource = <T>(
        qParams: any = {},
        cancelTokenSourcesRef?: MutableRefObject<Canceler[]>,
        meta?: BuildDataSourceMetaData
    ): IServerSideDatasource => {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                emRef
                    .find<T>(
                        pageNo,
                        {
                            order: buildSortParams(request),
                            ...buildFilterParams(request),
                            ...qParams,
                        },
                        (c) => {
                            if (
                                cancelTokenSourcesRef &&
                                cancelTokenSourcesRef.current
                            ) {
                                cancelTokenSourcesRef.current.push(c);
                            }
                        }
                    )
                    .then(({ error, errorMessage, response }) => {
                        if (error !== null) {
                            errorToast(errorMessage);
                        } else if (response !== null) {
                            if (response.items.length === 0) {
                                api?.showNoRowsOverlay();
                            }
                            setTotalItems(response.totalItems);
                            params.successCallback(
                                response.items,
                                response.totalItems
                            );
                        }
                    });
            },
        };
    };

    return {
        handleDeleteById,
        setFilter,
        buildDataSource,
    };
}
