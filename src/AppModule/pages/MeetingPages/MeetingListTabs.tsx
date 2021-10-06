import React, { FC } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface MeetingListTabsType {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export const MeetingListTabs: FC<MeetingListTabsType> = ({
    activeTab,
    setActiveTab,
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
                                    activeTab === "my-meetings" ? "active" : ""
                                }`}
                                onClick={(e) => handleActive(e, "my-meetings")}
                            >
                                {t("meeting.list:tab.title.myMeetings")}
                            </a>
                            <a
                                href={"#"}
                                className={`nav-link nav-item ${
                                    activeTab === "my-bookings" ? "active" : ""
                                }`}
                                onClick={(e) => handleActive(e, "my-bookings")}
                            >
                                {t("meeting.list:tab.title.myBookings")}
                            </a>
                        </div>
                    </nav>
                </div>
            </Col>
        </Row>
    );
};
