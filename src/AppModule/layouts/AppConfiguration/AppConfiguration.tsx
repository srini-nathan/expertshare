import React, { FC, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useSetRecoilState } from "recoil";
import { Container, Role } from "../../../AdminModule/models";
import { ContainerApi, RoleApi } from "../../../AdminModule/apis";
import { errorToast } from "../../utils";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AppContext } from "../../contexts/AppContext";
import { ContainerTypes } from "../../contexts/types";
import { AuthState } from "../../../SecurityModule/models";
import { appContainer } from "../../atoms/AppContainer";

export const AppConfiguration: FC = ({ children }) => {
    const { dispatch } = React.useContext(AppContext);
    const { state } = React.useContext(AuthContext);
    const setAppContainer = useSetRecoilState(appContainer);
    const { containerId } = state as AuthState;
    const [
        containerConfiguration,
        setContainerConfiguration,
    ] = React.useState<any>();

    useEffect(() => {
        if (containerId) {
            dispatch({
                type: ContainerTypes.LOADING,
            });
            ContainerApi.findById<Container>(containerId).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        setAppContainer(response);
                        setContainerConfiguration(response.configuration);
                        dispatch({
                            type: ContainerTypes.SUCCESS,
                            payload: response,
                        });
                    }
                }
            );
        }
    }, [containerId]);

    useEffect(() => {
        // @TODO: Don't store in localstorage, store them in context and use them,and loads only when user is Super-Admin or Admin
        const roles = localStorage.getItem("roles");
        if (!roles) {
            RoleApi.find<Role>().then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Roles not found");
                    } else if (response !== null) {
                        localStorage.setItem(
                            "roles",
                            JSON.stringify(response.items)
                        );
                    }
                }
            );
        }
    }, []);

    const renderScripts = () => {
        return (
            <Helmet>
                {containerConfiguration &&
                    containerConfiguration.googleAnalyticsCode &&
                    containerConfiguration.googleAnalyticsCode !== "" && (
                        <script
                            async
                            src={`https://www.googletagmanager.com/gtag/js?id=${containerConfiguration.googleAnalyticsCode}`}
                        ></script>
                    )}
                {containerConfiguration &&
                    containerConfiguration.isHubspotEnable &&
                    containerConfiguration.hubspotId !== "" && (
                        <script
                            type="text/javascript"
                            id="hs-script-loader"
                            async
                            defer
                            src={`//js.hs-scripts.com/${containerConfiguration.hubspotId}.js`}
                        ></script>
                    )}
            </Helmet>
        );
    };

    return (
        <>
            {renderScripts()}
            {children}
        </>
    );
};
