import React, { FC, Fragment, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { GridApi } from "ag-grid-community";
import { Row } from "react-bootstrap";
import { AppPageHeader } from "../../../AppModule/components";
import { AppContainerComponent } from "../../components/AppContainerComponent";

export const ContainerOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const appGridApi = useRef<GridApi>();
    const initValueForContainer = [
        {
            title: "Global Forum 2021",
            content:
                " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est ultrices sapien id  elementum, semper urna a arcu ipsum. Nunc  sollicitudin semper neque adipiscing ornare nec",
            imageUrl:
                "http://html.srmedia.ch/v2/assets/images/oveview_banner/ov-banner-1.png",
        },
        {
            title: "Global Forum 2021",
            content:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Est ultrices sapien id  elementum, semper urna a arcu ipsum. Nunc  sollicitudin semper neque adipiscing ornare nec",
            imageUrl:
                "http://html.srmedia.ch/v2/assets/images/oveview_banner/ov-banner-2.png",
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
                title={"Containers"}
                createLink={`/containers/overview`}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            <Row style={{ margin: "0 auto" }}>
                <AppContainerComponent
                    containers={initValueForContainer}
                ></AppContainerComponent>
            </Row>
        </Fragment>
    );
};
