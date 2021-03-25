import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { navigate } from "@reach/router";
import { AppButton } from "../AppButton";

export interface AppListPageToolbarProps {
    createLink?: string;
    createLabel?: string;
}

export const AppListPageToolbar: FC<AppListPageToolbarProps> = ({
    createLink,
    createLabel = "Create New",
}): JSX.Element => {
    return (
        <Row>
            <Col md={6}></Col>
            <Col md={6} className={"d-flex justify-content-end"}>
                {createLink ? (
                    <AppButton
                        onClick={() => {
                            navigate(createLink);
                        }}
                    >
                        + {createLabel}
                    </AppButton>
                ) : null}
            </Col>
        </Row>
    );
};
