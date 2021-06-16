import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import "./assets/scss/style.scss";
import { Session } from "../../../AdminModule/models";

export interface AppSessionTagsProps {
    session: Session;
}

export const AppSessionTags: FC<AppSessionTagsProps> = ({
    session,
}): JSX.Element => {
    const { sessionTags } = session;
    const { t } = useTranslation();
    return (
        <Col sm={12} className="session-details-tags mb-4 mt-4 mt-md-0 px-4">
            {sessionTags.length > 0 && [
                <h2>
                    <i className="fak fa-tags"></i>
                    {t("sessionDetails:label.tags")}
                </h2>,
                <div className="session-details-tags--container">
                    <Row className="m-0 p-0">
                        {sessionTags.map((e, i) => {
                            return (
                                <Col
                                    key={i}
                                    sm={"auto"}
                                    className="session-details-tags--container--item pl-0 pr-2 mt-3"
                                >
                                    <Link to="#">{e.name}</Link>
                                </Col>
                            );
                        })}
                    </Row>
                </div>,
            ]}
        </Col>
    );
};
