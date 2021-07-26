import React, { FC } from "react";
import { Container } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import AppNavigation from "../../containers/AppNavigation/AppNavigation";
import { appNavigations } from "../../bootstrap";
import {
    AppDashboardLayoutOptions,
    appDashboardLayoutOptions,
} from "../../atoms";
import { AppMessages } from "../../containers/AppMessages";
import { useBuildAssetPath, useChosenContainer } from "../../hooks";
import { AppCallOneToOne } from "../../containers/AppCallOneToOne";
import { useGlobalData } from "../../contexts";
import { getBGStyle, parseDesign } from "../../utils";
import { CONSTANTS } from "../../../config";
import { FileTypeInfo } from "../../models";

const {
    Upload: {
        FILETYPEINFO: { FILETYPEINFO_DESIGN_CONFIGURATION },
    },
} = CONSTANTS;

export const DashboardLayout: FC = ({ children }) => {
    const {
        hideNav,
        hideMessenger,
    } = useRecoilValue<AppDashboardLayoutOptions>(appDashboardLayoutOptions);

    const isA3d = window.location !== window.parent.location;
    const onBoarding = window.location.pathname;
    const { isChosen } = useChosenContainer();
    const { container } = useGlobalData();
    const design = parseDesign(container);
    const baseDesignConfig = useBuildAssetPath(
        FILETYPEINFO_DESIGN_CONFIGURATION as FileTypeInfo
    );
    const { navPosition, genImageBackgroundLogin } = design;
    const backgroundImageStyle = getBGStyle(
        baseDesignConfig,
        genImageBackgroundLogin
    );

    const renderClass = () => {
        let classes = "";
        if (onBoarding === "/onboarding") {
            classes = "mb-0 with-bg";
        } else {
            classes = "mb-5";
        }
        if (hideNav || isA3d) {
            return classes;
        }
        if (navPosition === "BOTTOM") {
            classes += " bottom-nav";
            return classes;
        }
        classes += " right-container";

        return classes;
    };
    return (
        <Container className={"p-0 unfixed"} fluid={true}>
            {hideNav || isA3d ? null : <AppNavigation items={appNavigations} />}
            <div
                className={`app-container ${renderClass()} mr-0 ml-auto`}
                style={onBoarding === "/onboarding" ? backgroundImageStyle : {}}
            >
                <div className="col-md-12 col-sm-12 col-xl-12 p-3 p-lg-4">
                    {children}
                </div>
                {isChosen() && !isA3d && (
                    <AppMessages disable={hideMessenger} />
                )}
                <AppCallOneToOne />
            </div>
        </Container>
    );
};
