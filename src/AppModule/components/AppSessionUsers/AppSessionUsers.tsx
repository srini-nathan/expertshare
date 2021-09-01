import React, { FC, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AppUserSelector } from "../AppUserSelector";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";
import { User } from "../../../AdminModule/models";
import { AppUserListItem } from "../AppUserListItem";

export interface AppSessionUsersProps {
    handleSelectedUsers?: (users: User[]) => void;
    users?: User[];
    selectedUsers: User[];
    title: string;
    icon: string;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    showAdd?: boolean;
    loadMore?: (value?: string) => void;
    onStateChange?: (state: boolean) => void;
    state?: boolean;
}

export const AppSessionUsers: FC<AppSessionUsersProps> = ({
    users = [],
    title,
    icon,
    sm,
    md,
    lg,
    xl,
    showAdd = false,
    loadMore,
    handleSelectedUsers = () => {},
    selectedUsers = [],
    onStateChange = () => {},
    state = false,
}): JSX.Element => {
    const [show, isShow] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        onStateChange(show);
    }, [show]);

    useEffect(() => {
        isShow(state);
    }, [state]);

    return (
        <Row className="m-0">
            <Col sm={12} className="create-session--speakers--header px-0">
                <Row className="m-0 p-0">
                    <Col
                        sm={"auto"}
                        className="create-session--speakers--header--name px-0"
                    >
                        <h3>
                            <i className={`fak fa-${icon}`}></i>
                            {title}
                        </h3>
                    </Col>
                    {showAdd && (
                        <>
                            <Col
                                sm={"auto"}
                                className="create-session--speakers--header--button mr-0 ml-auto px-0"
                            >
                                <AppButton
                                    onClick={() => {
                                        isShow(true);
                                    }}
                                    variant={"secondary"}
                                    className=" add-btn"
                                >
                                    <i className="fak fa-plus-light mr-2"></i>
                                    {t("common.button:add")}
                                </AppButton>
                            </Col>
                            <AppUserSelector
                                users={users}
                                show={show}
                                handleClose={isShow}
                                handleSelectedUsers={handleSelectedUsers}
                                selectedUsers={selectedUsers}
                                loadMore={loadMore}
                            />
                        </>
                    )}
                </Row>
            </Col>
            <Col
                sm={12}
                className="create-session--speakers--container px-0 mt-3"
            >
                <Row className="m-0 p-0">
                    {selectedUsers.map((item: User) => {
                        return (
                            <Col
                                md={md}
                                sm={sm}
                                lg={lg}
                                xl={xl}
                                className="create-session--moderators--container--item pl-0 mt-2"
                            >
                                <AppUserListItem user={item as User} />
                            </Col>
                        );
                    })}
                </Row>
            </Col>
        </Row>
    );
};
