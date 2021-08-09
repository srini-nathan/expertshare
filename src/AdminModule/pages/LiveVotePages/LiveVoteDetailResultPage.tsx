import React, { FC, Fragment, useState, useRef } from "react";
import { RouteComponentProps, useParams, Link } from "@reach/router";
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
import { LiveVoteResultApi } from "../../apis";
import { Language } from "../../models";
import { AppPageHeader } from "../../../AppModule/components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";
import { errorToast, successToast } from "../../../AppModule/utils";

export const LiveVoteDetailResultPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { questionId } = useParams();
    const [totalItems, setTotalItems] = useState<number>(0);
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { t } = useTranslation();

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                LiveVoteResultApi.find<Language>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        "voteQuestion.id": questionId,
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
        LiveVoteResultApi.deleteById(id).then(({ error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(t(error));
                }
            } else {
                successToast(
                    t("admin.liveVoteResult.list:delete.toast.success")
                );
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
                title={t("admin.liveVoteResult.list:header.title")}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            <Row>
                <Col>
                    <div className="live-voting-result--tabs mt-4 mb-2">
                        <nav>
                            <div
                                className="nav nav-tabs"
                                id="nav-tab"
                                role="tablist"
                            >
                                <span
                                    className="nav-link active"
                                    id="myGrid-tab"
                                >
                                    Details
                                </span>
                                <Link
                                    className="nav-link"
                                    id="myGrid2-tab"
                                    to={`/admin/live-votes-result/${questionId}/overview`}
                                >
                                    Results
                                </Link>
                            </div>
                        </nav>
                    </div>
                </Col>
            </Row>
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
