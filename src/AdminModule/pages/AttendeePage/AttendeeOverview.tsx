import React, { FC, Fragment, useRef, useState } from "react";
import { RouteComponentProps, useLocation } from "@reach/router";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { Row, Col } from "react-bootstrap";
import { appGridColDef } from "./app-grid-col-def";
import {
    AppPageHeader,
    // AppConferenceCard,
    // AppLoader,
    AppSwitchView,
    AppListPageToolbar,
} from "../../../AppModule/components";
import "./assets/scss/style.scss";
import { AttendeeCard } from "../../components/AttendeeCard";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { AppGrid } from "../../../AppModule/containers/AppGrid";
import { appGridConfig } from "../../../AppModule/config";

export const AttendeeOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const appGridApi = useRef<GridApi>();
    const location = useLocation();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [total, setTotal] = useState<number>(0);
    const initialValues = [
        {
            id: 1,
            name: "Morris Warren",
            category: "Speaker",
            description:
                "Junior Security Officer and Design Consultant at Nevis",
            email: "morris@expershare.me",
            tags: ["All users", "Another Tag Here"],
            online: true,
            avatarUrl:
                "http://html.srmedia.ch//v2/assets/images/profiles_pic_attendees/user-1.png",
        },
        {
            id: 2,
            name: "Cameron Williamson",
            category: "Speaker",
            description:
                "Junior Security Officer and Design Consultant at Nevis",
            email: "cameron@expershare.me",
            tags: ["All users", "Another Tag Here"],
            online: false,
            avatarUrl:
                "http://html.srmedia.ch//v2/assets/images/profiles_pic_attendees/user-2.png",
        },
        {
            id: 3,
            name: "Jenny Wilson",
            category: "Speaker",
            description:
                "Junior Security Officer and Design Consultant at Nevis",
            email: "cameron@expershare.me",
            tags: ["All users", "Another Tag Here"],
            online: true,
            avatarUrl:
                "http://html.srmedia.ch//v2/assets/images/profiles_pic_attendees/user-3.png",
        },
        {
            id: 4,
            name: "Brooklyn Simmons",
            category: "Speaker",
            description:
                "Junior Security Officer and Design Consultant at Nevis",
            email: "brook@expershare.me",
            tags: ["All users", "Special Invites", "Another Tag Here"],
            online: false,
            avatarUrl:
                "http://html.srmedia.ch//v2/assets/images/profiles_pic_attendees/user-4.png",
        },
    ];
    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            name: {
                filter: search,
            },
        });
    }
    function getDataSource(): IServerSideDatasource {
        return {
            getRows(params: IServerSideGetRowsParams) {
                const { request, api } = params;
                const { endRow } = request;
                const pageNo = endRow / appGridConfig.pageSize;
                // eslint-disable-next-line no-console
                console.log("pageNo", pageNo);
                api?.hideOverlay();
                setTotal(initialValues.length);
                params.successCallback(initialValues, initialValues.length);
            },
        };
    }
    async function handleBookSessionClick() {
        alert("You clicked book session button");
    }
    async function handleGetInContactClick() {
        alert("You clicked get in contract button");
    }
    async function handleAddNewUser() {
        alert("You clicked new user icon");
    }

    const renderView = () => {
        switch (location.pathname) {
            case "/admin/attendees/list":
                return (
                    <Col className="p-0">
                        <AppGrid
                            frameworkComponents={appGridFrameworkComponents}
                            columnDef={appGridColDef({
                                onPressBookSession: handleBookSessionClick,
                                onPressGetInContact: handleGetInContactClick,
                                onPressAddNewUser: handleAddNewUser,
                            })}
                            totalItems={total}
                            dataSource={getDataSource()}
                            onReady={(event) => {
                                appGridApi.current = event.api;
                            }}
                        />
                    </Col>
                );
            case "/admin/attendees/grid":
            default:
                return (
                    <Row>
                        {initialValues.map((item, index) => (
                            <Col
                                xs={12}
                                md={6}
                                lg={4}
                                xl={3}
                                className="attendees-grid--container--item"
                            >
                                <AttendeeCard attendee={item} key={index} />
                            </Col>
                        ))}
                    </Row>
                );
        }
    };

    return (
        <Fragment>
            <AppPageHeader title={"Attendees"} customToolbar>
                <div className="d-flex pt-2 mb-5">
                    <AppListPageToolbar
                        onQuickFilterChange={handleFilter}
                        cancelTokenSources={cancelTokenSourcesRef.current}
                    />
                    <AppSwitchView
                        link={"/admin/attendees"}
                        activeLink={
                            location.pathname === "/admin/attendees/list"
                                ? "list"
                                : "grid"
                        }
                    />
                </div>
            </AppPageHeader>
            {renderView()}
        </Fragment>
    );
};
