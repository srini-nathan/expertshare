import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { GridApi } from "ag-grid-community";
import { Row } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { errorToast } from "../../../AppModule/utils";
import { AppPageHeader } from "../../../AppModule/components";
import { AppContainerComponent } from "../../components/AppContainerComponent";
import { ContainerOverviewApi } from "../../apis/OverviewApi";
import { ContainerView } from "../../models/entities/ContainerView";

export const ContainerOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const appGridApi = useRef<GridApi>();
    const [overviews, setOverviews] = useState<ContainerView[]>([]);
    async function handleFilter(search: string) {
        appGridApi.current?.setFilterModel({
            name: {
                filter: search,
            },
        });
    }
    useEffect(() => {
        ContainerOverviewApi.find<ContainerView>(1, {}, (c) => {
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
                createLink={`/containers/overview`}
                onQuickFilterChange={handleFilter}
                cancelTokenSources={cancelTokenSourcesRef.current}
                showToolbar
            />
            <Row style={{ margin: "0 auto" }}>
                <AppContainerComponent
                    containers={overviews}
                ></AppContainerComponent>
            </Row>
        </Fragment>
    );
};
