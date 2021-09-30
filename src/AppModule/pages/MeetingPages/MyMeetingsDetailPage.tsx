import React, { FC, Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps, useParams } from "@reach/router";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { Col, Row } from "react-bootstrap";
import { useAuthState } from "../../hooks";
import { appGridConfig } from "../../config";
import { MeetingBookingApi } from "../../apis/MeetingBookingApi";
import { MeetingBooking } from "../../models/entities/MeetingBooking";
import {
    AppGrid,
    buildFilterParams,
    buildSortParams,
} from "../../containers/AppGrid";
import { errorToast } from "../../utils";
import { myMeetingsDetailAppGridFrameworkComponents } from "./app-grid-framework-components";
import { myMeetingsDetailGridColDef } from "./app-grid-col-def";
import { AppBreadcrumb, AppPageHeader } from "../../components";

export const MyMeetingsDetailPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { id } = useParams();
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const { clientId, containerId, userId } = useAuthState();

    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                api?.hideOverlay();
                MeetingBookingApi.find<MeetingBooking>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        "client.id": clientId,
                        "container.id": containerId,
                        "user.id": userId,
                        "meeting.id": id,
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

    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("meeting.list:header.title")}
                linkUrl={"/meetings"}
            />
            <AppPageHeader
                title={t("meeting.myMeetingsDetail.list:header.title")}
            ></AppPageHeader>
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={
                            myMeetingsDetailAppGridFrameworkComponents
                        }
                        columnDef={myMeetingsDetailGridColDef()}
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
