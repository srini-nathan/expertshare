import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { GridApi } from "ag-grid-community";
import { Row, Col } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { errorToast } from "../../../AppModule/utils";
import { AppPageHeader } from "../../../AppModule/components";
import { AppContainerOverview } from "../../components";
import { ContainerApi } from "../../apis";
import { useAuthState } from "../../../AppModule/hooks";
import { PContainer } from "../../models";

export const ContainerOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const { clientId } = useAuthState();
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [overviews, setOverviews] = useState<PContainer[]>([]);
    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            domain: {
                filter: search,
            },
        });
    }
    useEffect(() => {
        ContainerApi.overview<PContainer>(1, { "client.id": clientId }, (c) => {
            cancelTokenSourcesRef.current.push(c);
        }).then(({ response, error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setOverviews(response.items);
            }
        });
    }, []);
    return (
        <Fragment>
            <AppPageHeader
                title={"Containers"}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            <Row>
                {overviews.map((container: PContainer) => (
                    <Col xs={12} sm={6} md={4} key={container.id}>
                        <AppContainerOverview container={container} />
                    </Col>
                ))}
            </Row>
        </Fragment>
    );
};