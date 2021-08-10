import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Session } from "../../../AdminModule/models";
import "./assets/scss/style.scss";

export interface AppSessionExtraLinkProps {
    session: Session;
}

export const AppSessionExtraLink: FC<AppSessionExtraLinkProps> = ({
    session,
}): JSX.Element => {
    const { t } = useTranslation();
    const {
        isExternalLinkEnable,
        externalLinkLabel,
        externalLinkUrl,
    } = session;
    if (
        !isExternalLinkEnable ||
        externalLinkLabel === "" ||
        externalLinkUrl === ""
    ) {
        return <></>;
    }
    return (
        <Col sm={12} className="session-details-tags mb-4 mt-4 mt-md-0 px-4">
            <h2>
                <i className="fak fa-tags"></i>
                {t("sessionDetails:label.extra")}
            </h2>
            <div className="session-details-tags--container">
                <Row className="m-0 p-0">
                    <Col xs={"auto"} className="pl-0 pr-2 mt-3">
                        <a href={externalLinkUrl} target={"_blank"}>
                            {externalLinkLabel}
                        </a>
                    </Col>
                </Row>
            </div>
        </Col>
    );
};
