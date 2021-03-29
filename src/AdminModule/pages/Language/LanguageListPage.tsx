import React, { FC, Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Row, Col } from "react-bootstrap";
import {
    GridApi,
    GridReadyEvent,
    IServerSideDatasource,
    IServerSideGetRowsParams,
    ServerSideStoreType,
} from "ag-grid-community";
import { ColumnApi } from "ag-grid-community/dist/lib/columnController/columnApi";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import { PaginationChangedEvent } from "ag-grid-community/dist/lib/events";
import { AppPageHeader } from "../../../AppModule/components/AppPageHeader";
import { AppListPageToolbar } from "../../../AppModule/components/AppListPageToolbar";
import { LanguageApi } from "../../apis/LanguageApi";
import { Language } from "../../models";
import { ListResponse } from "../../../AppModule/models";
import { AppGridPagination } from "../../../AppModule/components/AppGridPagination";

const GlobalGridConfig = {
    pageSize: 30,
};

export const LanguageListPage: FC<RouteComponentProps> = (): JSX.Element => {
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
        <Fragment>
            <AppPageHeader title={"Language"} />
            <AppListPageToolbar
                createLabel={"Create Language"}
                createLink={"languages/new"}
            />
            <Row>
                <Col>
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
                </Col>
            </Row>
            <hr />
            <Row>
                <Col className={"d-flex justify-content-end"}>
                    <AppGridPagination
                        totalItems={totalItems}
                        active={active}
                        onClick={(pageNumber) => {
                            // eslint-disable-next-line no-console
                            console.log(pageNumber, "page");
                            gridApi?.paginationGoToPage(pageNumber - 1);
                        }}
                    />
                </Col>
            </Row>
        </Fragment>
    );
};
