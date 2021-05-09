import React, { FC, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
    GridApi,
    GridReadyEvent,
    IServerSideDatasource,
    PaginationChangedEvent,
    ServerSideStoreType,
} from "ag-grid-community";
import { ColumnApi } from "ag-grid-community/dist/lib/columnController/columnApi";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import {
    AppGridPagination,
    AppGridNoRowsOverlay,
    AppFormDropdown,
} from "../../components";
import { appGridConfig } from "../../config";
import { AppGridPageSizeOption } from "../../models";

import "ag-grid-enterprise";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "./assets/scss/style.scss";
import { defaultPageSize, pageSizeOptions } from "./app-grid-helpers";

export interface AppGridProps {
    columnDef: ColDef[];
    dataSource: IServerSideDatasource;
    totalItems: number;
    frameworkComponents?: any;
    onReady?: (event: GridReadyEvent) => void;
}

export const AppGrid: FC<AppGridProps> = ({
    columnDef,
    dataSource,
    totalItems,
    frameworkComponents,
    onReady,
}) => {
    const [gridApi, setGridApi] = useState<GridApi>();
    const [, setGridColumnApi] = useState<ColumnApi>();
    const [pageSize, setPageSize] = useState<number>(appGridConfig.pageSize);
    const [active, setActive] = useState<number>(1);

    const onGridReady = (event: GridReadyEvent) => {
        if (onReady) {
            onReady(event);
        }
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
            <div className="app-grid">
                <div className="ag-theme-alpine">
                    <AgGridReact
                        frameworkComponents={{
                            ...frameworkComponents,
                            customNoRowsOverlay: AppGridNoRowsOverlay,
                        }}
                        defaultColDef={{
                            flex: 1,
                            minWidth: 150,
                            sortable: true,
                            resizable: true,
                        }}
                        rowHeight={62}
                        rowModelType={"serverSide"}
                        serverSideStoreType={ServerSideStoreType.Partial}
                        paginationPageSize={pageSize}
                        suppressPaginationPanel={true}
                        cacheBlockSize={pageSize}
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
                        noRowsOverlayComponent={"customNoRowsOverlay"}
                        noRowsOverlayComponentParams={{
                            noRowsMessageFunc() {
                                return `Sorry - no data!`;
                            },
                        }}
                    />
                </div>
                <br />
                <div className="d-flex flex-row app-grid-action">
                    <div className="pagination-container mr-3">
                        <AppFormDropdown
                            id={"pageSize"}
                            defaultValue={defaultPageSize()}
                            options={pageSizeOptions()}
                            menuPlacement={"top"}
                            onChange={(selectedValue) => {
                                const {
                                    value,
                                } = selectedValue as AppGridPageSizeOption;
                                gridApi?.paginationSetPageSize(value);
                                setPageSize(value);
                            }}
                        />
                    </div>
                    <AppGridPagination
                        itemsPerPage={pageSize}
                        totalItems={totalItems}
                        active={active}
                        onClick={(pageNumber) => {
                            gridApi?.paginationGoToPage(pageNumber - 1);
                        }}
                    />
                </div>
            </div>
        </React.Fragment>
    );
};
