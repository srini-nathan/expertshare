import React, { FC, Fragment, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { GridApi } from "ag-grid-community";
import { Canceler } from "axios";
import { AppPageHeader, AppTabs, AppTab } from "../../../AppModule/components";
import { UserGroupList } from "./UserGroupList";

export const UserGroupListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const appGridApi = useRef<GridApi>();
    const appGridApiGenerated = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);

    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            name: {
                filter: search,
            },
        });
        appGridApiGenerated.current?.setFilterModel({
            name: {
                filter: search,
            },
        });
    }

    return (
        <Fragment>
            <AppPageHeader
                title={"User Groups"}
                showToolbar
                createLink={"user-groups/new"}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
            />
            <Row className="m-0">
                <AppTabs defaultKeyValue="custom">
                    <AppTab eventKey="custom" title="Custom">
                        <Col className="p-0 mt-4">
                            <UserGroupList
                                appGridApi={appGridApi}
                                isGenerated={false}
                            />
                        </Col>
                    </AppTab>
                    <AppTab eventKey="generated" title="Generated">
                        <Col className="p-0  mt-4">
                            <UserGroupList
                                appGridApi={appGridApiGenerated}
                                isGenerated={true}
                            />
                        </Col>
                    </AppTab>
                </AppTabs>
            </Row>
        </Fragment>
    );
};
