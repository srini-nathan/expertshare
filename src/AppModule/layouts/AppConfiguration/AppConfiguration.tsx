import React, { FC, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Container } from "../../../AdminModule/models";
import { ContainerApi } from "../../../AdminModule/apis";
import { errorToast } from "../../utils";
import { AuthContext } from "../../Authentication/context/AuthContext";

export const AppConfiguration: FC = ({ children }) => {
    const { state } = React.useContext(AuthContext);
    const { cntid } = state;
    const [
        containerConfiguration,
        setContainerConfiguration,
    ] = React.useState<any>();

    useEffect(() => {
        if (cntid) {
            ContainerApi.getById<Container>(cntid).then(
                ({ response, isNotFound, errorMessage }) => {
                    if (errorMessage) {
                        errorToast(errorMessage);
                    } else if (isNotFound) {
                        errorToast("Container not exist");
                    } else if (response !== null) {
                        setContainerConfiguration(response.configuration);
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
