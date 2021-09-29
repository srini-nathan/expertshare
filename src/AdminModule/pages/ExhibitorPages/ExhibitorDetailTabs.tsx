import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface ExhibitorDetailTabsType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    productsTotalCount: number;
}

export const ExhibitorDetailTabs: FC<ExhibitorDetailTabsType> = ({
    activeTab,
    setActiveTab,
    productsTotalCount,
}) => {
    const { t } = useTranslation();

    const handleActive = (e: React.MouseEvent, tab: string) => {
        e.stopPropagation();
        e.preventDefault();
        setActiveTab(tab);
    };

    return (
        <Row>
            <Col className={"d-flex justify-content-between mb-2"}>
                <div className="d-inline-block categories-nav--tabs">
                    <nav>
                        <div className="nav nav-tabs">
                            <a
                                href={"#"}
                                className={`nav-link nav-item ${
                                    activeTab === "details" ? "active" : ""
                                }`}
                                onClick={(e) => handleActive(e, "details")}
                            >
                                {t("admin.exhibitor.details:tab.title.details")}
                            </a>
                            {productsTotalCount > 0 && (
                                <>
                                    <a
                                        href={"#"}
                                        className={`nav-link nav-item ${
                                            activeTab === "products"
                                                ? "active"
                                                : ""
                                        }`}
                                        onClick={(e) =>
                                            handleActive(e, "products")
                                        }
                                    >
                                        {t(
                                            "admin.exhibitor.details:tab.title.products"
                                        )}
                                    </a>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            </Col>
        </Row>
    );
};
