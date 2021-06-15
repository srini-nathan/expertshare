import React, { FC } from "react";
import { RouteComponentProps } from "@reach/router";
import { Tab, Row } from "react-bootstrap";
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

export const MyProfilePage: FC<RouteComponentProps> = (): JSX.Element => {
    const { state } = React.useContext(AuthContext);
    const { user } = state as AuthState;
    return (
        <>
            <AppProfileHeader {...user} />
            <Tab.Container defaultActiveKey="Feeds">
                <Row className="m-0">
                    <AppTabWithIcon
                        className="mr-3"
                        eventKey="Feeds"
                        title="My Feeds"
                        icon="fak fa-columns-regular"
                    ></AppTabWithIcon>
                    <AppTabWithIcon
                        eventKey="Profile"
                        title="Profile"
                        icon="fak fa-user-regular"
                    ></AppTabWithIcon>
                </Row>
                <Tab.Pane className="mt-4 " eventKey="Profile">
                    <AppTabs defaultKeyValue="General">
                        <AppTab eventKey="General" title="General">
                            <UpdateProfile />
                        </AppTab>

                        <AppTab eventKey="Setings" title="Setings">
                            <Row className="m-0 pt-3">
                                <AppCard title="Privacy & Communication">
                                    <UpdatePrivacy />
                                </AppCard>
                            </Row>
                        </AppTab>
                        <AppTab
                            eventKey="ChangePassword"
                            title="Change Password"
                        >
                            <ChangePassword />
                        </AppTab>
                    </AppTabs>
                </Tab.Pane>
            </Tab.Container>
        </>
    );
};
