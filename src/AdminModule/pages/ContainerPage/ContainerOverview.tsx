import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { GridApi } from "ag-grid-community";
import { Row, Col } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { useSetRecoilState } from "recoil";
import { errorToast } from "../../../AppModule/utils";
import { AppPageHeader } from "../../../AppModule/components";
import { AppContainerOverview } from "../../components";
import { ContainerApi } from "../../apis";
import { useAuthState } from "../../../AppModule/hooks";
import { PContainer } from "../../models";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
} from "../../../AppModule/atoms";

export const ContainerOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const { clientId } = useAuthState();
    const appGridApi = useRef<GridApi>();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [overviews, setOverviews] = useState<PContainer[]>([]);
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );

    useEffect(() => {
        setLayoutOptions((currVal) => {
            return {
                ...currVal,
                hideNav: true,
            };
        });
        return () => {
            setLayoutOptions((currVal) => {
                return {
                    ...currVal,
                    hideNav: false,
                };
            });
        };
    });

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
                    <Col xs={12} sm={4} md={3} key={container.id}>
                        <AppContainerOverview container={container} />
                    </Col>
                ))}
            </Row>
        </Fragment>
    );
};
