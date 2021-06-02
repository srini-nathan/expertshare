import React, { FC, Fragment, useRef, useState } from "react";
import { RouteComponentProps, useLocation } from "@reach/router";
import {
    GridApi,
    IServerSideDatasource,
    IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { appGridColDef } from "./app-grid-col-def";
import { AppPageHeader } from "../../../AppModule/components";
import "./assets/scss/style.scss";
import { AttendeeCard } from "../../components/AttendeeCard";
import { appGridFrameworkComponents } from "./app-grid-framework-components";
import { AppGrid } from "../../../AppModule/containers/AppGrid";

export const AttendeeOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const appGridApi = useRef<GridApi>();
    const location = useLocation();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [total, setTotal] = useState<number>(0);
    const initialValues = [
        {
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
            name: "Cameron Williamson",
            description:
                "Junior Security Officer and Design Consultant at Nevis",
            email: "cameron@expershare.me",
            tags: ["All users", "Another Tag Here"],
            online: false,
            avatarUrl:
                "http://html.srmedia.ch//v2/assets/images/profiles_pic_attendees/user-2.png",
        },
        {
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
            name: "Brooklyn Simmons",
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
                const { api } = params;
                api?.hideOverlay();
                setTotal(initialValues.length);
                params.successCallback(initialValues, initialValues.length);
            },
        };
    }
    async function handleBookSessionClick() {
        alert(1);
    }
    async function handleGetInContactClick() {
        alert(1);
    }

    return (
        <Fragment>
            <AppPageHeader
                title={"Attendee"}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
                showViewLayoutButtons={true}
            />
            {location.pathname === "/admin/attendees/list" && (
                <Row>
                    <Col>
                        <AppGrid
                            frameworkComponents={appGridFrameworkComponents}
                            columnDef={appGridColDef({
                                onPressBookSession: handleBookSessionClick,
                                onPressGetInContact: handleGetInContactClick,
                            })}
                            totalItems={total}
                            dataSource={getDataSource()}
                            onReady={(event) => {
                                appGridApi.current = event.api;
                            }}
                        />
                    </Col>
                </Row>
            )}
            <Container fluid>
                <Row>
                    {location.pathname === "/admin/attendees" &&
                        initialValues.map((item, index) => (
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
            </Container>
        </Fragment>
    );
};
