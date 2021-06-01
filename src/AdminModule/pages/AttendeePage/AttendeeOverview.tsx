import React, { FC, Fragment, useRef } from "react";
import { RouteComponentProps, useLocation } from "@reach/router";
import {
    GridApi,
    // IServerSideDatasource,
    // IServerSideGetRowsParams,
} from "ag-grid-community";
import { Canceler } from "axios";
// import { Row } from "react-bootstrap";
import { AppPageHeader } from "../../../AppModule/components";
import "./assets/scss/style.scss";
import { AttendeeCard } from "../../components/AttendeeCard";
// import { appGridFrameworkComponents } from "./app-grid-framework-components";
// import { AppGrid } from "../../../AppModule/containers/AppGrid";

export const AttendeeOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const appGridApi = useRef<GridApi>();
    const location = useLocation();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
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
    return (
        <Fragment>
            <AppPageHeader
                title={"Attendee"}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
                showTypeSwitch={true}
            />
            {location.pathname === "/admin/attendees" && (
                <AttendeeCard attendees={initialValues} />
            )}
        </Fragment>
    );
};
