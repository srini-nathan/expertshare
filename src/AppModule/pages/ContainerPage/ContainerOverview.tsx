import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { GridApi } from "ag-grid-community";
import { Row, Col } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { useSetRecoilState } from "recoil";
import { errorToast } from "../../utils";
import { AppPageHeader, AppContainerOverviewCard } from "../../components";

import { ContainerApi } from "../../../AdminModule/apis";
import { useAuthState } from "../../hooks";
import { PContainer } from "../../../AdminModule/models";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
} from "../../atoms";
import { AuthApi } from "../../../SecurityModule/apis";
import { route } from "../../../config";

type GetToken = {
    token: boolean | string;
};

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

    const checkForAccess = (container: PContainer) => {
        const { domain, id } = container;
        const path = `http://${domain}/auth/auto-login/{token}`;
        if (id) {
            // @TODO: remove any type from here
            AuthApi.checkAndGetToken<GetToken | any>(id)
                .then(({ token }) => {
                    if (token) {
                        if (token === false) {
                            errorToast(
                                "You're not allowed to login on this container."
                            );
                        } else {
                            window.location.href = route(path, { token });
                        }
                    }
                })
                .catch((error) => {
                    errorToast(error.message);
                });
        }
    };

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
                    <Col xs={12} sm={6} md={4} lg={3} xl={3} key={container.id}>
                        <AppContainerOverviewCard
                            container={container}
                            onClick={() => {
                                checkForAccess(container);
                            }}
                        />
                    </Col>
                ))}
            </Row>
        </Fragment>
    );
};
