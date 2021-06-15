import React, { FC, Fragment, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Col, Row } from "react-bootstrap";
import { Canceler } from "axios";
import { isString as _isString } from "lodash";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { AppPageHeader } from "../../../AppModule/components";

import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";

import { ClientApi } from "../../apis";
import { Client } from "../../models";
import { errorToast, successToast } from "../../../AppModule/utils";

export const ClientList: FC<RouteComponentProps> = (): JSX.Element => {
    const [totalItems, setTotalItems] = useState<number>(0);
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                ClientApi.find<Client>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
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
        ClientApi.deleteById(id).then(({ error }) => {
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
            name: {
                filter: search,
            },
        });
    }

    return (
        <Fragment>
            <AppPageHeader
                title={"Clients"}
                createLink={"/admin/clients/new"}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appGridColDef({
                            onPressDelete: handleDelete,
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
