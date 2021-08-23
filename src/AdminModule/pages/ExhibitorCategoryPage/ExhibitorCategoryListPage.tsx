import React, { FC, Fragment, useState, useRef } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { isString as _isString } from "lodash";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { appGridColDef } from "./app-grid-col-def";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { ExhibitorCategoryApi } from "../../apis";
import { ExhibitorCategory } from "../../models";
import { AppPageHeader } from "../../../AppModule/components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import "./assets/scss/list.scss";
import { appGridConfig } from "../../../AppModule/config";
import { errorToast, successToast } from "../../../AppModule/utils";
import { useAuthState } from "../../../AppModule/hooks";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models/context/AuthState";

export const ExhibitorCategoryListPage: FC<RouteComponentProps> = () => {
    const [totalItems, setTotalItems] = useState<number>(0);
    // const [loading, setLoading] = useState<boolean>(false);
    const appGridApi = useRef<GridApi>();
    const { containerId } = useAuthState();
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { t } = useTranslation();
    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                // setLoading(true);
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                ExhibitorCategoryApi.find<ExhibitorCategory>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        locale: user?.locale || "en",
                        ...buildFilterParams(request),
                        "container.id": containerId,
                    },
                    (c) => {
                        cancelTokenSourcesRef.current.push(c);
                    }
                ).then(({ error, response }) => {
                    // setLoading(false);
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
        ExhibitorCategoryApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else {
                successToast(t("admin.exhibitorCategory.list:delete.success"));
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
            <Row>
                <Col className={"d-flex justify-content-between mb-5"}>
                    <div className="d-inline-block categories-nav--tabs">
                        <nav>
                            <div
                                className="nav nav-tabs"
                                id="nav-tab"
                                role="tablist"
                            >
                                <Link
                                    className="nav-link nav-item"
                                    id="myGrid2-tab"
                                    to={`/admin/session-categories`}
                                >
                                    {t("admin.sessionCategory.list:tab.title")}
                                </Link>
                                <a
                                    className="nav-link active nav-item"
                                    id="myGrid-tab"
                                >
                                    {t(
                                        "admin.exhibitorCategory.list:tab.title"
                                    )}
                                </a>
                            </div>
                        </nav>
                    </div>
                </Col>
            </Row>
            <AppPageHeader
                title={t("admin.exhibitorCategory.list:header.title")}
                createLink={"/admin/exhibitor-categories/new"}
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
