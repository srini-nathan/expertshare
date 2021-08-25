import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface ExhibitorListTabsType {
    isVisible: boolean;
    setIsVisible: (status: boolean) => void;
}

export const ExhibitorListTabs: FC<ExhibitorListTabsType> = ({
    isVisible,
    setIsVisible,
}) => {
    const { t } = useTranslation();
    return (
        <Row>
            <Col className={"d-flex justify-content-between mb-5"}>
                <div className="d-inline-block categories-nav--tabs">
                    <nav>
                        <div className="nav nav-tabs">
                            <a
                                href={"#"}
                                className={`nav-link nav-item ${
                                    isVisible ? "active" : ""
                                }`}
                                onClick={() => setIsVisible(true)}
                            >
                                {t("admin.exhibitor.list:tab.title.active")}
                            </a>
                            <a
                                href={"#"}
                                className={`nav-link nav-item ${
                                    !isVisible ? "active" : ""
                                }`}
                                onClick={() => setIsVisible(false)}
                            >
                                {t("admin.exhibitor.list:tab.title.inActive")}
                            </a>
                        </div>
                    </nav>
                </div>
            </Col>
        </Row>
    );
};
