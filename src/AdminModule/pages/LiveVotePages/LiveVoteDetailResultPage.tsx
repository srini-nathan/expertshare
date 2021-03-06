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
import { appLiveVoteResultGridColDef } from "./app-grid-col-def";
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
    const { questionId, conferenceId = null, sessionId = null } = useParams();
    const [totalItems, setTotalItems] = useState<number>(0);
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const { t } = useTranslation();
    const [updateLink] = useDownloadFile();
    const { role } = useAuthState();
    const backLink =
        conferenceId && sessionId
            ? `/event/${conferenceId}/session/${sessionId}`
            : "/admin/live-votes";

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
                linkText={
                    conferenceId && sessionId
                        ? t("admin.liveVotes.list:header.backToSession")
                        : t("admin.liveVote.list:header.title")
                }
                linkUrl={backLink}
            />
            <AppPageHeader
                title={t("admin.liveVoteResult.list:header.title")}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            {role === ROLES.ROLE_ADMIN ? (
                <Row>
                    <Col className={"d-flex justify-content-end mb-4"}>
                        <div className={"live-vote-result-header-button"}>
                            <AppButton
                                onClick={handleDownload}
                                variant={"secondary"}
                                className={"download-btn pl-4 pr-3 mr-2"}
                            >
                                <i className={"fak fa-download"}></i>
                                {t("admin.liveVoteResult.list:button.download")}
                            </AppButton>
                        </div>
                    </Col>
                </Row>
            ) : null}
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={appLiveVoteResultGridColDef({
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
