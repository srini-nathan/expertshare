import React, { FC, Fragment, useState } from "react";
import { RouteComponentProps } from "@reach/router";

import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
// import { ICellRendererParams } from "ag-grid-community";
import "./style.scss";
import {
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Col, Row } from "react-bootstrap";
import { ListResponse } from "../../../AppModule/models";
import { AppPageHeader } from "../../../AppModule/components/AppPageHeader";
import { AppListPageToolbar } from "../../../AppModule/components/AppListPageToolbar";
import {
    AppGrid,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { ClientApi } from "../../apis/ClientApi";
import { Client } from "../../../lib/API/Api";
import { appGridConfig } from "../../../AppModule/config";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";
import { sweetError, sweetSuccess } from "../../../AppModule/components/Util";

export const ClientList: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    async function handleDelete(id: number) {
        try {
            await ClientApi.delete<void>(id);
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
                editLink: "/admin/client/",
                addLink: "/admin/client/new",
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
                    />
                </Col>
            </Row>
            <hr />
        </Fragment>
    );
};
