import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { isString as _isString } from "lodash";
import "./assets/scss/style.scss";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Col, Row } from "react-bootstrap";
import { Canceler } from "axios";
import {
    AppClientInformation,
    AppPageHeader,
} from "../../../AppModule/components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { appGridConfig } from "../../../AppModule/config";
import { ContainerApi } from "../../apis/ContainerApi";
import { Client, Container } from "../../models";
import { ClientApi } from "../../apis";
import { errorToast, successToast } from "../../../AppModule/utils";

export const ContainerList: FC<RouteComponentProps> = (): JSX.Element => {
    const { clientId } = useParams();
    const [totalItems, setTotalItems] = useState<number>(0);
    const [client, setClient] = useState<Client>();
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);

    useEffect(() => {
        ClientApi.getById<Client>(clientId).then(
            ({ response, isNotFound, errorMessage }) => {
                if (errorMessage) {
                    errorToast(errorMessage);
                } else if (isNotFound) {
                    errorToast("Client not exist");
                } else if (response !== null) {
                    setClient(response);
                }
            }
        );
        return () => {};
    }, [clientId]);

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                ContainerApi.find<Container>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        "client.id": clientId,
                    },
                    (c) => {
                        cancelTokenSourcesRef.current.push(c);
                    }
                ).then(({ error, response }) => {
                    if (error !== null) {
                        if (_isString(error)) {
                            errorToast(error);
                        }
                    } else if (response !== null) {
                        if (response.items.length === 0) {
                            api?.showNoRowsOverlay();
                        }
                        setTotalItems(response.totalItems);
                        params.successCallback(
                            response.items,
                            response.totalItems
                        );
                    }
                });
            },
        };
    }

    async function handleDelete(id: number) {
        ContainerApi.delete(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast("Successfully deleted");
                appGridApi.current?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
            }
        });
    }

    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            domain: {
                filter: search,
            },
        });
    }

    return (
        <Fragment>
            <AppPageHeader
                title={"Container"}
                createLabel={"Create Container"}
                createLink={`/admin/clients/${clientId}/containers/new`}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            <AppClientInformation title={client?.name || ""} />
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appGridColDef({
                            onPressDelete: handleDelete,
                            parentId: clientId,
                        })}
                        dataSource={getDataSource()}
                        totalItems={totalItems}
                        onReady={(event) => {
                            appGridApi.current = event.api;
                        }}
                    />
                </Col>
            </Row>
        </Fragment>
    );
};
