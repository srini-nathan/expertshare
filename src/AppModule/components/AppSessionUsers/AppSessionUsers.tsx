import React, { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "@reach/router";
import { AppUserSelector } from "../AppUserSelector";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";
import { User } from "../../../AdminModule/models";

export interface AppSessionUsersProps {
    handleSelectedUsers?: (users: User[]) => void;
    users?: User[];
    selectedUsers: User[];
    role: string;
    title: string;
    icon: string;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    showAdd?: boolean;
}

export const AppSessionUsers: FC<AppSessionUsersProps> = ({
    users = [],
    title,
    role,
    icon,
    sm,
    md,
    lg,
    xl,
    showAdd = false,
    handleSelectedUsers = () => {},
    selectedUsers = [],
}): JSX.Element => {
    const [show, isShow] = useState<boolean>(false);

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
                                    <i className="fak fa-plus-light"></i>
                                    Add
                                </AppButton>
                            </Col>
                            <AppUserSelector
                                users={users}
                                role={role}
                                show={show}
                                handleClose={isShow}
                                handleSelectedUsers={handleSelectedUsers}
                                selectedUsers={selectedUsers}
                            />
                        </>
                    )}
                </Row>
            </Col>
            <Col sm={12} className="create-session--speakers--container px-0">
                <Row className="m-0 p-0">
                    {selectedUsers.map((item: User) => {
                        return (
                            <Col
                                md={md}
                                sm={sm}
                                lg={lg}
                                xl={xl}
                                className="create-session--moderators--container--item pl-0 mt-4"
                            >
                                <Link to="#">
                                    <Row className="m-0 p-0">
                                        <i className="avatar col-md-auto col-lg-auto pl-0 col-auto col-xl-auto"></i>
                                        <Col
                                            lg={8}
                                            md={8}
                                            xl={8}
                                            className="name-details pr-0"
                                        >
                                            <h3>
                                                {item.firstName} {item.lastName}
                                            </h3>
                                            <p>
                                                {item.jobTitle}@{item.company}
                                            </p>
                                        </Col>
                                    </Row>
                                </Link>
                            </Col>
                        );
                    })}
                </Row>
            </Col>
        </Row>
    );
};
