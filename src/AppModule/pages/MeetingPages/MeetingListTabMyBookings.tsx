import React, { FC, Fragment, useRef, useState } from "react";
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
import { myBookingsAppGridFrameworkComponents } from "./app-grid-framework-components";
import { myBookingsGridColDef } from "./app-grid-col-def";
import { errorToast } from "../../utils";
import { appGridConfig } from "../../config";
import { useAuthState } from "../../hooks";
import { MeetingBookingApi } from "../../apis/MeetingBookingApi";
import { MeetingBooking } from "../../models/entities/MeetingBooking";

export const MeetingListTabMyBookings: FC = (): JSX.Element => {
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
                MeetingBookingApi.getMyBookings<MeetingBooking>(
                    pageNo,
                    {
                        order: buildSortParams(request),
                        ...buildFilterParams(request),
                        "client.id": clientId,
                        "container.id": containerId,
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

    return (
        <Fragment>
            <Row>
                <Col>
                    <AppGrid
                        frameworkComponents={
                            myBookingsAppGridFrameworkComponents
                        }
                        columnDef={myBookingsGridColDef()}
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
