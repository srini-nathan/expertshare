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
import { AppPageHeader } from "../../../AppModule/components/AppPageHeader";
import { AppListPageToolbar } from "../../../AppModule/components/AppListPageToolbar";
import { LanguageApi } from "../../apis/LanguageApi";
import { Language } from "../../models";

const GlobalGridConfig = {
    pageSize: 30,
};

export const LanguageListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [, setGridApi] = useState<GridApi>();
    const [, setGridColumnApi] = useState<ColumnApi>();
    const onGridReady = (event: GridReadyEvent) => {
        setGridApi(event.api);
        setGridColumnApi(event.columnApi);

        const dataSource: IServerSideDatasource = {
            getRows(params: IServerSideGetRowsParams) {
                // eslint-disable-next-line no-console
                console.log(params, `asking for ${params} to ${params}`);
                const { request } = params;
                const { endRow } = request;
                const pageNo = endRow / GlobalGridConfig.pageSize;
                LanguageApi.findAll<Language[]>(pageNo).then((data) => {
                    params.successCallback(data, 200);
                });
            },
        };

        event.api.setServerSideDatasource(dataSource);
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
                            cacheBlockSize={GlobalGridConfig.pageSize}
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
        </Fragment>
    );
};
