import React, { FC, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Container } from "../../../AdminModule/models";
import { ContainerApi } from "../../../AdminModule/apis";
import { errorToast } from "../../utils";
import { AuthContext } from "../../Authentication/context/AuthContext";
import { AppContext } from "../../Contexts/AppContext";
import { ContainerTypes } from "../../Contexts/Types";

export const AppConfiguration: FC = ({ children }) => {
    const { dispatch } = React.useContext(AppContext);
    const { state } = React.useContext(AuthContext);
    const { cntid } = state;
    const [
        containerConfiguration,
        setContainerConfiguration,
    ] = React.useState<any>();

    useEffect(() => {
        if (cntid) {
            dispatch({
                type: ContainerTypes.LOADING,
            });
            ContainerApi.getById<Container>(cntid).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        setContainerConfiguration(response.configuration);
                        dispatch({
                            type: ContainerTypes.SUCCESS,
                            payload: response,
                        });
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
