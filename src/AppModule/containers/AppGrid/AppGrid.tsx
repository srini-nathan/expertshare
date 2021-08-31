import React, { FC, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { useTranslation } from "react-i18next";
import { LicenseManager } from "ag-grid-enterprise";
import {
    GridApi,
    GridOptions,
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
    paginationContainerClass?: string;
    gridOptions?: GridOptions;
}

export const AppGrid: FC<AppGridProps> = ({
    columnDef,
    dataSource,
    totalItems,
    frameworkComponents,
    onReady,
    paginationContainerClass = "d-flex flex-row app-grid-action py-3",
    gridOptions = {},
}) => {
    const { t } = useTranslation();
    const [gridApi, setGridApi] = useState<GridApi>();
    const [, setGridColumnApi] = useState<ColumnApi>();
    const [pageSize, setPageSize] = useState<number>(appGridConfig.pageSize);
    const [active, setActive] = useState<number>(1);

    LicenseManager.setLicenseKey(
        "CompanyName=expertshare ag,LicensedApplication=expertshare,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=1,LicensedProductionInstancesCount=0,AssetReference=AG-016725,ExpiryDate=22_June_2022_[v2]_MTY1NTg1MjQwMDAwMA==8b2876cda869451b48d10ae8640350d3"
    );

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

    const columns: ColDef[] = columnDef.map((column: ColDef) => {
        if (column.headerName) {
            return {
                ...column,
                headerName: t(column.headerName),
            };
        }
        return column;
    });

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
                            ...gridOptions,
                        }}
                        columnDefs={columns}
                        noRowsOverlayComponent={"customNoRowsOverlay"}
                        noRowsOverlayComponentParams={{
                            noRowsMessageFunc() {
                                return t("common.list:message.nodata");
                            },
                        }}
                    />
                </div>
                <br />
                {totalItems > 9 ? (
                    <div className={paginationContainerClass}>
                        <AppGridPagination
                            className="mr-3"
                            itemsPerPage={pageSize}
                            totalItems={totalItems}
                            active={active}
                            onClick={(pageNumber) => {
                                gridApi?.paginationGoToPage(pageNumber - 1);
                            }}
                        />

                        <div className="pagination-container">
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
                    </div>
                ) : null}
            </div>
        </React.Fragment>
    );
};
