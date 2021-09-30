/* eslint-disable no-nested-ternary */
import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

    if (session.description === "" && session.sessionDocs.length === 0) {
        return <> </>;
    }

    return (
        <AppCard>
            <Row className="m-0 mb-3 mb-lg-4">
                {session.description !== "" ? (
                    <Col
                        sm={12}
                        lg={session.sessionDocs.length > 0 ? 4 : 12}
                        xl={session.sessionDocs.length > 0 ? 6 : 12}
                        className="session-details-desc my-1 pt-1 px-2"
                    >
                        <h2>
                            <i className="fak fa-description"></i>
                            {t("sessionDetails:section.description")}
                        </h2>
                        <div className="session-details-desc--container mt-3">
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: session.description,
                                }}
                            ></p>
                        </div>
                    </Col>
                ) : null}
                {session.sessionDocs.length > 0 ? (
                    <Col
                        sm={12}
                        lg={4}
                        xl={6}
                        className="session-details-docs  my-1 pt-1 px-2"
                    >
                        <AppSessionDoc
                            showAddDelete={false}
                            files={session.sessionDocs}
                        />
                    </Col>
                ) : null}
            </Row>
        </AppCard>
    );
};
