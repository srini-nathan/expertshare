import React, { FC, Fragment, useState, useRef } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
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
import { LiveVoteQuestionApi, LiveVoteResultApi } from "../../apis";
import { Language } from "../../models";
import {
    AppBreadcrumb,
    AppButton,
    AppPageHeader,
} from "../../../AppModule/components";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";
import {
    errorToast,
    hideLoader,
    showLoader,
    successToast,
} from "../../../AppModule/utils";
import { useAuthState, useDownloadFile } from "../../../AppModule/hooks";
import { ROLES } from "../../../config";

export const LiveVoteDetailResultPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { questionId, conferenceId, sessionId } = useParams();
    const [totalItems, setTotalItems] = useState<number>(0);
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { t } = useTranslation();
    const [updateLink] = useDownloadFile();
    const { role } = useAuthState();

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

    async function handleDownload() {
        await showLoader(t("admin.liveVoteResult.list:result.downloading"));
        LiveVoteQuestionApi.downloadResult(questionId).then((res) => {
            updateLink({
                name: `${questionId}-result.csv`,
                type: "file/csv",
                file: res,
            });
            hideLoader();
        });
    }

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("admin.liveVoteResult.list:header.backToSession")}
                linkUrl={`/event/${conferenceId}/session/${sessionId}`}
            />
            <AppPageHeader
                title={t("admin.liveVoteResult.list:header.title")}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            {role === ROLES.ROLE_ADMIN ? (
                <Row>
                    <Col className={"d-flex justify-content-end mb-5"}>
                        <div className={""}>
                            <AppButton
                                onClick={handleDownload}
                                variant={"secondary"}
                            >
                                <i className={"fak fa-download mr-2"}>
                                    {t(
                                        "admin.liveVoteResult.list:button.download"
                                    )}
                                </i>
                            </AppButton>
                        </div>
                    </Col>
                </Row>
            ) : null}
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
