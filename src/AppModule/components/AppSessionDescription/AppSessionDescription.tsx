/* eslint-disable no-nested-ternary */
import React, { FC, useState } from "react";
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
    const [isReadMore, setIsReadMore] = useState(true);
    const showMore = () => {
        if (session.description.length < 800) return "";
        if (isReadMore) return "+Show More";
        return "-Show Less";
    };
    return (
        <AppCard>
            <Row className="m-0 mb-3 mb-lg-4">
                <Col
                    sm={12}
                    lg={4}
                    xl={6}
                    className="session-details-desc my-4 pt-1 px-2"
                >
                    <h2>
                        <i className="fak fa-description"></i>
                        {t("sessionDetails:section.description")}
                    </h2>
                    <div className="session-details-desc--container mt-3">
                        <p>
                            {isReadMore
                                ? session.description.slice(0, 800)
                                : session.description}
                            <span
                                onClick={() => {
                                    setIsReadMore(!isReadMore);
                                }}
                                className="read-or-hide mt-3"
                            >
                                {showMore()}
                            </span>
                        </p>
                    </div>
                </Col>
                <Col
                    sm={12}
                    lg={4}
                    xl={6}
                    className="session-details-docs  my-4 pt-1 px-2"
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
