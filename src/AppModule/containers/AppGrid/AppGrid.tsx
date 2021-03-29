import React, { FC, useState } from "react";
import { AgGridReact } from "ag-grid-react";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./assets/scss/style.scss";
import {
    GridApi,
    GridReadyEvent,
    IServerSideDatasource,
    ServerSideStoreType,
} from "ag-grid-community";
import { ColumnApi } from "ag-grid-community/dist/lib/columnController/columnApi";
import { PaginationChangedEvent } from "ag-grid-community/dist/lib/events";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import { AppGridPagination } from "../../components/AppGridPagination";

export const GlobalGridConfig = {
    pageSize: 30,
};
export interface AppGridProps {
    columnDef: ColDef[];
    dataSource: IServerSideDatasource;
    totalItems: number;
}

export const AppGrid: FC<AppGridProps> = ({
    columnDef,
    dataSource,
    totalItems,
}) => {
    const [gridApi, setGridApi] = useState<GridApi>();
    const [, setGridColumnApi] = useState<ColumnApi>();

    const [active, setActive] = useState<number>(1);
    const onGridReady = (event: GridReadyEvent) => {
        setGridApi(event.api);
        setGridColumnApi(event.columnApi);

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
                    columnDefs={columnDef}
                />
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
