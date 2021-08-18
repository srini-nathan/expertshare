import { useTranslation } from "react-i18next";
import { EntityAPI } from "../apis";
import { errorToast, successToast } from "../utils";

type FunctionMetaData = {
    success?: string;
    onSuccess?: <T>(data?: T) => void;
    error?: string;
    onError?: () => void;
    onCleanup?: () => void;
};

interface BuildDataSourceMetaData<T> {
    onSuccess?: (data: ListResponse<T>) => void;
    onError?: () => void;
}

interface FindByIdMetaData<T> {
    onSuccess?: (data: T) => void;
    error?: string;
    onError?: () => void;
    onCleanup?: () => void;
}

type UseCRUDHelperFunctionsType = {
    handleDeleteById: (id: number, metaData?: FunctionMetaData) => void;
    setFilter: (search: string, fieldMap: string[]) => void;
    buildDataSource: <T>(
        qParams?: any,
        cancelTokenSourcesRef?: MutableRefObject<Canceler[]>,
        metaData?: BuildDataSourceMetaData<T>
    ) => IServerSideDatasource;
    findById: <T>(id: number, qParams: any, meta?: FindByIdMetaData<T>) => void;
};

export function useCRUDHelperFunctions(
    emRef: typeof EntityAPI
): UseCRUDHelperFunctionsType {
    const entityManager: typeof EntityAPI = emRef;
    const { t } = useTranslation();

    const handleDeleteById = (id: number, metaData: FunctionMetaData = {}) => {
        const {
            success,
            error: customErrorMsg,
            onSuccess,
            onError,
            onCleanup,
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
        meta: BuildDataSourceMetaData<T> = {}
    ): IServerSideDatasource => {
        const { onSuccess } = meta;
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                entityManager
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
                            if (onSuccess) {
                                onSuccess(response);
                            }
                            if (response.items.length === 0) {
                                api?.showNoRowsOverlay();
                            }
                            params.successCallback(
                                response.items,
                                response.totalItems
                            );
                        }
                    });
            },
        };
    };

    const findById = <T>(
        id: number,
        qParams: any = {},
        meta: FindByIdMetaData<T> = {}
    ): void => {
        const { onSuccess, onError, error, onCleanup } = meta;
        entityManager
            .findById<T>(id, qParams)
            .then(({ response, isNotFound, errorMessage }) => {
                if (isNotFound) {
                    if (error) {
                        errorToast(t(error));
                    } else {
                        errorToast(t(errorMessage));
                    }
                    if (onError) {
                        onError();
                    }
                } else if (response !== null) {
                    if (onSuccess) {
                        onSuccess(response);
                    }
                }
            })
            .finally(() => {
                if (onCleanup) {
                    onCleanup();
                }
            });
    };

    return {
        handleDeleteById,
        setFilter,
        buildDataSource,
        findById,
    };
}
