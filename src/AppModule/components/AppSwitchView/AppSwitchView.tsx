import React, { FC } from "react";
import { Col } from "react-bootstrap";
import { Link } from "@reach/router";
import { AppIcon } from "../AppIcon";
import "./assets/scss/style.scss";

export interface AppSwitchViewProps {
    activeLink: string;
    link: string;
}

export const AppSwitchView: FC<AppSwitchViewProps> = ({
    activeLink,
    link,
}): JSX.Element => {
    return (
        <Col className={"switch-view p-0 mx-2"}>
            <Link
                className={activeLink === "" ? `active-view` : ""}
                to={`${link}`}
            >
                <AppIcon name="Grid" />
            </Link>
            <Link
                className={activeLink === "list" ? `active-view` : ""}
                to={`${link}/list`}
            >
                <AppIcon name="List" />
            </Link>
        </Col>
    );
};
