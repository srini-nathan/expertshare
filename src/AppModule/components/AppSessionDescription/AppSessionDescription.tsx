import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { AppCard } from "../AppCard";
import { AppSessionDoc } from "../AppSessionDoc";
import "./assets/scss/style.scss";
import { Session } from "../../../AdminModule/models";

export interface AppSessionDescriptionProps {
    session: Session;
}

export const AppSessionDescription: FC<AppSessionDescriptionProps> = ({
    session,
}): JSX.Element => {
    return (
        <AppCard>
            <Row className="m-0 mb-3 mb-lg-4">
                <Col
                    sm={12}
                    lg={4}
                    xl={6}
                    className="session-details-desc my-4 pt-1 px-4"
                >
                    <h2>
                        <i className="fak fa-description"></i>
                        Description
                    </h2>
                    <div className="session-details-desc--container mt-3">
                        <p>{session.description}</p>
                    </div>
                </Col>
                <Col
                    sm={12}
                    lg={4}
                    xl={6}
                    className="session-details-docs  my-4 pt-1 px-4"
                >
                    <AppSessionDoc
                        showAddDelete={false}
                        files={session.sessionDocs}
                    />
                </Col>
            </Row>
        </AppCard>
    );
};