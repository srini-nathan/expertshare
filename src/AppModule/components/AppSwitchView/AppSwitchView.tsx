import React, { FC } from "react";
import { Col } from "react-bootstrap";
import { Link } from "@reach/router";
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
        <Col className={"switch-view p-0 mx-0 ml-sm-2"}>
            <div className={"switch-view--content"}>
                <Link
                    className={activeLink === "" ? `active-view` : ""}
                    to={`${link}`}
                >
                    <i className="fak fa-th-large-regular"></i>
                </Link>
                <Link
                    className={activeLink === "list" ? `active-view` : ""}
                    to={`${link}/list`}
                >
                    <i className="fak fa-bars-regular"></i>
                </Link>
            </div>
        </Col>
    );
};
