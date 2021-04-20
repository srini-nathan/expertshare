import React, { FC, Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Col, Row } from "react-bootstrap";
import { ListResponse } from "../../../AppModule/models";
import {
    AppPageHeader,
    AppListPageToolbar,
} from "../../../AppModule/components";

import {
    AppGrid,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { ClientApi } from "../../apis";
import { Client } from "../../models";
import { appGridConfig } from "../../../AppModule/config";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";
import { sweetError, sweetSuccess } from "../../../AppModule/components/Util";

export const ClientList: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    let appGridApi: GridApi;

    async function handleDelete(id: number) {
        try {
            await ClientApi.delete(id).then(() => {
                appGridApi?.refreshServerSideStore({ purge: false, route: [] });
            });
            await sweetSuccess({ text: " Successfully deleted " });
        } catch (e) {
            await sweetError({ text: "Something Went Wrong!" });
        }
    }
    const columnDef: ColDef[] = [
        {
            headerName: "Client",
            field: "name",
            flex: 1,
        },
        {
            headerName: "Notes",
            field: "notes",
            flex: 2,
        },
        {
            headerName: "Actions",
            field: "id",
            sortable: false,
            cellRenderer: "appGridActionRenderer",
            cellClass: "text-right",
            headerClass: "action-header",
            cellRendererParams: {
                callback: handleDelete,
                editLink: ClientApi.CLIENT_LIST_PAGE_PATH,
                addLink: ClientApi.CLIENT_NEW_PAGE_PATH,
            },
        },
    ];
    const frameworkComponents = {
        appGridActionRenderer: AppGridAction,
    };

    const dataSource: IServerSideDatasource = {
        getRows(params: IServerSideGetRowsParams) {
            const { request } = params;
            const { endRow } = request;
            const pageNo = endRow / appGridConfig.pageSize;
            ClientApi.findAll<Client>(pageNo, {
                order: buildSortParams(request),
            }).then((res: ListResponse<Client>) => {
                setTotalItems(res.totalItems);
                params.successCallback(res.items, res.totalItems);
            });
        },
    };
    return (
        <Fragment>
            <AppPageHeader title={"Client"} />
            <AppListPageToolbar
                createLabel={"Create Client"}
                createLink={"client/new"}
            />
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={frameworkComponents}
                        columnDef={columnDef}
                        dataSource={dataSource}
                        totalItems={totalItems}
                        onReady={(event) => {
                            appGridApi = event.api;
                        }}
                    />
                </Col>
            </Row>
            <hr />
        </Fragment>
    );
};
