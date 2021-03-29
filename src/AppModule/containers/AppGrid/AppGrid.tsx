import React, { FC, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./assets/scss/style.scss";
import {
    GridApi,
    GridReadyEvent,
    IServerSideDatasource,
    IServerSideGetRowsParams,
    ServerSideStoreType,
} from "ag-grid-community";
import { ColumnApi } from "ag-grid-community/dist/lib/columnController/columnApi";
import { PaginationChangedEvent } from "ag-grid-community/dist/lib/events";
import { LanguageApi } from "../../../AdminModule/apis/LanguageApi";
import { Language } from "../../../AdminModule/models";
import { ListResponse } from "../../models";
import { AppGridPagination } from "../../components/AppGridPagination";

const GlobalGridConfig = {
    pageSize: 30,
};

export interface AppGridProps {
    data: any[];
}

export const AppGrid: FC<AppGridProps> = ({ data }) => {
    const [gridApi, setGridApi] = useState<GridApi>();
    const [, setGridColumnApi] = useState<ColumnApi>();
    const [totalItems, setTotalItems] = useState<number>(0);
    const [active, setActive] = useState<number>(1);
    const onGridReady = (event: GridReadyEvent) => {
        setGridApi(event.api);
        setGridColumnApi(event.columnApi);

        const dataSource: IServerSideDatasource = {
            getRows(params: IServerSideGetRowsParams) {
                // eslint-disable-next-line no-console
                console.log("IServerSideDatasource", params);
                const { request } = params;
                const { endRow } = request;
                const pageNo = endRow / GlobalGridConfig.pageSize;
                LanguageApi.findAll<Language>(pageNo).then(
                    (data: ListResponse<Language>) => {
                        setTotalItems(data.totalItems);
                        params.successCallback(data.items, data.totalItems);
                    }
                );
            },
        };

        event.api.setServerSideDatasource(dataSource);
    };

    const onPaginationChanged = (event: PaginationChangedEvent) => {
        const { api } = event;
        setActive(api.paginationGetCurrentPage() + 1);
    };

    return (
        <React.Fragment>
            <div className="ag-theme-alpine">
                <AgGridReact
                    defaultColDef={{
                        flex: 1,
                        minWidth: 150,
                        sortable: true,
                        resizable: true,
                    }}
                    rowModelType={"serverSide"}
                    serverSideStoreType={ServerSideStoreType.Partial}
                    paginationPageSize={GlobalGridConfig.pageSize}
                    suppressPaginationPanel={true}
                    cacheBlockSize={GlobalGridConfig.pageSize}
                    onPaginationChanged={onPaginationChanged}
                    pagination={true}
                    getRowNodeId={(item) => {
                        return item.id;
                    }}
                    onGridReady={onGridReady}
                    gridOptions={{
                        domLayout: "autoHeight",
                    }}
                >
                    <AgGridColumn field="id" />
                    <AgGridColumn field="name" />
                    <AgGridColumn field="locale" />
                </AgGridReact>
            </div>
            <br />
            <AppGridPagination
                totalItems={totalItems}
                active={active}
                onClick={(pageNumber) => {
                    gridApi?.paginationGoToPage(pageNumber - 1);
                }}
            />
        </React.Fragment>
    );
};
