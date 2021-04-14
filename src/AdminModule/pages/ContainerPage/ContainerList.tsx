import React, { FC, Fragment, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { ColDef } from "ag-grid-community/dist/lib/entities/colDef";
import "./style.scss";
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

import { appGridConfig } from "../../../AppModule/config";
import { AppGridAction } from "../../../AppModule/components/AppGridAction";
import { sweetError, sweetSuccess } from "../../../AppModule/components/Util";
import { ContainerApi } from "../../apis/ContainerApi";
import { Client, Container } from "../../models";
import { ClientApi } from "../../apis";

export const ContainerList: FC<RouteComponentProps> = (): JSX.Element => {
    const { clientId } = useParams();
    const [totalItems, setTotalItems] = useState<number>(0);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { client, setClient } = useState<Partial<Client>>({});

    let appGridApi: GridApi;

    useEffect(() => {
        ClientApi.findById<Client>(clientId)
            .then((res) => {
                // eslint-disable-next-line no-console
                console.log(res);
                return setClient(res);
            })
            .catch((err) => {
                // eslint-disable-next-line no-console
                console.log(err);
            });

        return () => {};
    }, [clientId, setClient]);

    async function handleDelete(id: number) {
        try {
            await ContainerApi.delete<void>(id).then(() => {
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
                editLink: ContainerApi.CONTAINER_LIST_PAGE_PATH,
                addLink: ContainerApi.CONTAINER_NEW_PAGE_PATH,
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
            ContainerApi.findAll<Container>(pageNo, {
                order: buildSortParams(request),
                clientId,
            }).then((res: ListResponse<Container>) => {
                setTotalItems(res.totalItems);
                params.successCallback(res.items, res.totalItems);
            });
        },
    };
    // eslint-disable-next-line no-console
    console.log(client);
    return (
        <Fragment>
            <AppPageHeader title={"Container"} />
            {/* <h2>{client.name}</h2> */}
            <AppListPageToolbar
                createLabel={"Create Container"}
                createLink={"container/new"}
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
