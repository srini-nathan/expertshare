import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface MeetingAddEditTabsProps {
    defaultActiveTab: number;
    onChangeTab: (tab: number) => void;
}

export const MeetingAddEditTabs = ({
    defaultActiveTab,
    onChangeTab,
}: MeetingAddEditTabsProps) => {
    const { t } = useTranslation();
    const [active, setActive] = useState<number>(defaultActiveTab);

    useEffect(() => {
        onChangeTab(active);
    }, [active]);

    const handleChange = (e: React.MouseEvent, tab: number) => {
        e.preventDefault();
        e.stopPropagation();
        setActive(tab);
    };

    return (
        <div className="inner-content--tabs tab-carousel">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                    <a
                        className={`nav-link ${active === 1 ? "active" : ""}`}
                        id="overview-tab"
                        data-toggle="tab"
                        href="#overview"
                        onClick={(e) => {
                            handleChange(e, 1);
                        }}
                        role="tab"
                        aria-controls="overview"
                        aria-selected="true"
                    >
                        <i>01</i>
                        {t("meeting.form:wizard.step1.overview")}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${active === 2 ? "active" : ""}`}
                        id="scheduling-tab"
                        data-toggle="tab"
                        href="#scheduling"
                        onClick={(e) => {
                            handleChange(e, 2);
                        }}
                        role="tab"
                        aria-controls="scheduling"
                        aria-selected="false"
                    >
                        <i>02</i>
                        {t("meeting.form:wizard.step2.scheduling")}
                    </a>
                </li>
                <li className="nav-item">
                    <a
                        className={`nav-link ${active === 3 ? "active" : ""}`}
                        id="confirmation-tab"
                        data-toggle="tab"
                        href="#confirmation"
                        onClick={(e) => {
                            handleChange(e, 3);
                        }}
                        role="tab"
                        aria-controls="confirmation"
                        aria-selected="false"
                    >
                        <i>03</i>
                        {t("meeting.form:wizard.step3.confirmation")}
                    </a>
                </li>
            </ul>
        </div>
    );
};
