import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { Tab, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
    AppProfileHeader,
    AppTabWithIcon,
    AppTabs,
    AppTab,
    AppCard,
} from "../../components";
import { AuthContext } from "../../../SecurityModule/contexts/AuthContext";
import { AuthState } from "../../../SecurityModule/models";
import { ChangePassword } from "./ChangePassword";
import { UpdateProfile } from "./UpdateProfile";
import { UpdatePrivacy } from "./UpdatePrivacy";
import "./assets/scss/style.scss";

export const MyProfilePage: FC<RouteComponentProps> = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    const { t } = useTranslation();
    return (
        <>
            <AppProfileHeader {...user} />
            <Tab.Container defaultActiveKey="Feeds">
                <Row className="m-0">
                    <AppTabWithIcon
                        className="mr-3"
                        eventKey="Feeds"
                        title={t("profile.update:tab.myFeed")}
                        icon="fak fa-columns-regular"
                    ></AppTabWithIcon>
                    <AppTabWithIcon
                        eventKey="Profile"
                        title={t("profile.update:tab.profile")}
                        icon="fak fa-user-regular"
                    ></AppTabWithIcon>
                </Row>
                <Tab.Pane className="mt-4 " eventKey="Profile">
                    <AppTabs defaultKeyValue="General">
                        <AppTab
                            eventKey="General"
                            title={t("profile.update:tab.general")}
                        >
                            <UpdateProfile />
                        </AppTab>

                        <AppTab
                            eventKey="Setings"
                            title={t("profile.update:tab.setting")}
                        >
                            <Row className="m-0 pt-3">
                                <AppCard
                                    title={t(
                                        "profile.update:label.sectionPrivacyAndCommunication"
                                    )}
                                >
                                    <UpdatePrivacy />
                                </AppCard>
                            </Row>
                        </AppTab>
                        <AppTab
                            eventKey="ChangePassword"
                            title={t("profile.update:tab.changePassword")}
                        >
                            <ChangePassword />
                        </AppTab>
                    </AppTabs>
                </Tab.Pane>
            </Tab.Container>
        </>
    );
};
