import React, { FC, Fragment, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import "./assets/scss/style.scss";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Col, Row } from "react-bootstrap";
import { ListResponse } from "../../../AppModule/models";
import {
    AppClientInformation,
    AppListPageToolbar,
    AppPageHeader,
} from "../../../AppModule/components";
import { AppGrid } from "../../../AppModule/containers/AppGrid";

import { appGridConfig } from "../../../AppModule/config";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";
import { sweetError, sweetSuccess } from "../../../AppModule/components/Util";
import { ContainerApi } from "../../apis/ContainerApi";
import { Client, Container } from "../../models";
import { ClientApi } from "../../apis";

export const ContainerList: FC<RouteComponentProps> = (): JSX.Element => {
    const { clientId } = useParams();
    const [totalItems, setTotalItems] = useState<number>(0);
    const [client, setClient] = useState<Client>();
    let appGridApi: GridApi;

    useEffect(() => {
        ClientApi.findById<Client>(clientId).then((res) => setClient(res));
        return () => {};
    }, [clientId, setClient]);

    async function handleDelete(id: number) {
        try {
            await ContainerApi.delete(id).then(() => {
                appGridApi?.refreshServerSideStore({ purge: false, route: [] });
            });
            await sweetSuccess({ text: " Successfully deleted " });
        } catch (e) {
            await sweetError({ text: "Something Went Wrong!" });
        }
    }

    const columnDef: ColDef[] = [
        {
            headerName: "Domain",
            field: "domain",
            flex: 1,
        },
        {
            headerName: "Storage",
            field: "storage",
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
                addLink: undefined,
                editLink: `${ClientApi.CLIENT_LIST_PAGE_PATH}${clientId}/container/`,
                ui: "Container",
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
            ContainerApi.findAllContainersByClient<Container>(
                pageNo,
                clientId
            ).then((res: ListResponse<Container>) => {
                setTotalItems(res.totalItems);
                params.successCallback(res.items, res.totalItems);
            });
        },
    };
    return (
        <Fragment>
            <AppPageHeader title={"Container"} />
            <AppListPageToolbar
                createLabel={"Create Container"}
                createLink={"container/new"}
            />
            <AppClientInformation title={client?.name || ""} />
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
