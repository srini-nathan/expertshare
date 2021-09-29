import React, { FC, Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../containers/AppGrid";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { myMeetingsGridColDef } from "./app-grid-col-def";
import { errorToast, successToast } from "../../utils";
import { appGridConfig } from "../../config";
import { useAuthState } from "../../hooks";
import { MeetingApi } from "../../apis/MeetingApi";
import { Meeting } from "../../models/entities/Meeting";

export const MeetingListTabMyMeetings: FC = (): JSX.Element => {
    const { t } = useTranslation();
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const { clientId, userId } = useAuthState();

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                MeetingApi.find<Meeting>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        "client.id": clientId,
                        "user.id": userId,
                    },
                    (c) => {
                        cancelTokenSourcesRef.current.push(c);
                    }
                ).then(({ error, errorMessage, response }) => {
                    if (error !== null) {
                        errorToast(errorMessage);
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
        MeetingApi.deleteById(id).then(({ error, errorMessage }) => {
            if (error !== null) {
                errorToast(t(errorMessage));
            } else {
                successToast(t("meeting.myMeetings.list:delete.toast.success"));
                appGridApi.current?.refreshServerSideStore({
                    purge: false,
                    route: [],
                });
            }
        });
    }

    return (
        <Fragment>
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={appGridFrameworkComponents}
                        columnDef={myMeetingsGridColDef({
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
