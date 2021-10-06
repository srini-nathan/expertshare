import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { UseFormReturn } from "react-hook-form";
import { Meeting } from "../../models/entities/Meeting";

interface MeetingAddEditTabsProps {
    defaultActiveTab: number;
    onChangeTab: (tab: number) => void;
}

export interface MeetingAddEditTabProps {
    active: number;
    data: Meeting;
    form: UseFormReturn<Meeting>;
    isEditMode: boolean;
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
            </ul>
        </div>
    );
};
