import React, { FC, useState, useRef } from "react";
import {
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { isString as _isString } from "lodash";
import { Canceler } from "axios";
import { appGridColDef } from "./app-grid-col-def";
import { appGridColDefGenerated } from "./app-grid-col-def-generated";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { UserGroupApi } from "../../apis";
import { UserGroup } from "../../models";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";
import { errorToast, successToast } from "../../../AppModule/utils";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";

export interface UserGroupListProps {
    appGridApi: any;
    isGenerated: boolean;
}

export const UserGroupList: FC<UserGroupListProps> = ({
    appGridApi,
    isGenerated,
}): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const { state } = React.useContext(AuthContext);
    const { clientId } = state as AuthState;
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                UserGroupApi.find<UserGroup>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        "client.id": clientId,
                        isGenerated,
                    },
                    (c) => {
                        cancelTokenSourcesRef.current.push(c);
                    }
                ).then(({ error, response }) => {
                    if (error !== null) {
                        if (_isString(error)) {
                            errorToast(error);
                        }
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
    }

    async function handleDelete(id: number) {
        UserGroupApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
                appGridApi.current?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
            }
        });
    }

    return (
        <AppGrid
            frameworkComponents={appGridFrameworkComponents}
            columnDef={
                isGenerated
                    ? appGridColDefGenerated()
                    : appGridColDef({
                          onPressDelete: handleDelete,
                      })
            }
            dataSource={getDataSource()}
            totalItems={totalItems}
            onReady={(event) => {
                appGridApi.current = event.api;
            }}
        />
    );
};
