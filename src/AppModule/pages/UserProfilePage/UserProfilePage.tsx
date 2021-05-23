import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import { Tab } from "react-bootstrap";
import { isString as _isString } from "lodash";
import { User } from "../../models/entities/User";
import { errorToast } from "../../utils";
import { UserApi } from "../../../AdminModule/apis";
import { AppProfileHeader, AppTabWithIcon, AppLoader } from "../../components";

export const UserProfilePage: FC<RouteComponentProps> = (): JSX.Element => {
    const [user, setUser] = useState<User>();
    const [loading, isLoading] = useState<boolean>(true);
    const { id } = useParams();
    useEffect(() => {
        isLoading(true);
        UserApi.getAttendeeView<User>(id).then(({ response, error }) => {
            isLoading(false);

            if (error !== null) {
                if (_isString(error)) {
                    errorToast(error);
                }
            } else if (response !== null) {
                setUser(response);
            }
        });
    }, []);

    if (loading) return <AppLoader />;

    return (
        <>
            <AppProfileHeader {...user} />
            <Tab.Container defaultActiveKey="Feeds">
                <AppTabWithIcon
                    eventKey="Feeds"
                    title="My Feeds"
                    icon="fak fa-columns-regular"
                ></AppTabWithIcon>
                <Tab.Pane className="mt-4" eventKey="Feeds"></Tab.Pane>
            </Tab.Container>
        </>
    );
};
