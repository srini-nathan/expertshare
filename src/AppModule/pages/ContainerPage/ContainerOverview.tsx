import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "@reach/router";
import { Canceler } from "axios";
import { Row, Col } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { errorToast, hideLoader, showLoader } from "../../utils";
import {
    AppPageHeader,
    AppContainerOverviewCard,
    AppButton,
} from "../../components";

import { ContainerApi } from "../../../AdminModule/apis";
import { useAuthState } from "../../hooks";
import { PContainer } from "../../../AdminModule/models";
import {
    appDashboardLayoutOptions,
    AppDashboardLayoutOptions,
    overViewLayout,
    normalLayout,
} from "../../atoms";
import { AuthApi } from "../../../SecurityModule/apis";
import { route } from "../../../config";
import {
    AuthContext,
    logoutAction,
} from "../../../SecurityModule/contexts/AuthContext";

type GetToken = {
    token: boolean | string;
};

export const ContainerOverview: FC<RouteComponentProps> = (): JSX.Element => {
    const { dispatch } = React.useContext(AuthContext);
    const { clientId } = useAuthState();
    const cancelTokenSourcesRef = useRef<Canceler[]>([]);
    const [overviews, setOverviews] = useState<PContainer[]>([]);
    const setLayoutOptions = useSetRecoilState<AppDashboardLayoutOptions>(
        appDashboardLayoutOptions
    );
    const { t } = useTranslation();

    const handleLogoutEvent = async (): Promise<void> => {
        await logoutAction(dispatch);
    };

    useEffect(() => {
        setLayoutOptions((currVal) => {
            return {
                ...currVal,
                ...overViewLayout,
            };
        });
        return () => {
            setLayoutOptions((currVal) => {
                return {
                    ...currVal,
                    ...normalLayout,
                };
            });
        };
    });

    const checkForAccess = (container: PContainer) => {
        showLoader(t("container:label.redirecting")).then(() => {});
        const { domain, id } = container;
        // @TODO: do something with hardcoded paths
        const path = `${window.location.protocol}//${domain}/auth/auto-login/{token}/1`;
        if (id) {
            // @TODO: remove any type from here
            AuthApi.checkAndGetToken<GetToken | any>(id)
                .then(({ token }) => {
                    hideLoader();
                    if (token) {
                        if (token === false) {
                            errorToast(t("container:message.notallowed"));
                        } else {
                            window.location.href = route(path, { token });
                        }
                    }
                })
                .catch((error) => {
                    hideLoader();
                    errorToast(error.message);
                });
        }
    };

    useEffect(() => {
        ContainerApi.overview<PContainer>(1, { "client.id": clientId }, (c) => {
            cancelTokenSourcesRef.current.push(c);
        }).then(({ response, error }) => {
            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                if (response.items.length === 1) {
                    checkForAccess(response.items[0]);
                } else {
                    setOverviews(response.items);
                }
            }
        });
    }, []);

    return (
        <Fragment>
            <AppPageHeader title={t("container:header.title")} customToolbar>
                <AppButton
                    variant="primary"
                    className="p-2"
                    onClick={handleLogoutEvent}
                >
                    <i className="fas fa-sign-out p-1"></i>
                    {t("container:button.logout")}
                </AppButton>
            </AppPageHeader>
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
