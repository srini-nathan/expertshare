import React, { FC, Fragment, useRef } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { GridApi } from "ag-grid-community";
import { AppPageHeader } from "../../../AppModule/components";

export const ContainerOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const appGridApi = useRef<GridApi>();
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
        </Fragment>
    );
};
