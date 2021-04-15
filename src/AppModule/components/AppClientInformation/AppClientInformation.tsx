import React, { FC } from "react";
import { Row } from "react-bootstrap";
import { AppIcon } from "../AppIcon";
import "./assets/scss/style.scss";

export interface AppClientInformationProps {
    title: string;
}

export const AppClientInformation: FC<AppClientInformationProps> = ({
    title,
}): JSX.Element => {
    return (
        <Row className="client-information p-3 mx-0 my-4">
            <div className="col-md-2">{title}</div>
            <div className="col-md-1">125</div>
            <div className="col-md-2">22/02/2021</div>
            <div className="col-md-5">123123</div>
            <div className="col-md-2 text-right">
                <a href="#" className={"mr-3"} onClick={() => {}}>
                    <AppIcon name={"delete"} />
                </a>
                <a href="#" onClick={() => {}}>
                    <AppIcon name={"edit"} />
                </a>
            </div>
        </Row>
    );
};
