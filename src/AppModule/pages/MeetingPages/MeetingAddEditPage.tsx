import React, { FC, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "@reach/router";
import "./assets/scss/style.scss";
import { AppBreadcrumb, AppPageHeader } from "../../components";
import { MeetingAddEditTabs } from "./MeetingAddEditTabs";
import { MeetingAddEditTab1 } from "./MeetingAddEditTab1";
import { MeetingAddEditTab2 } from "./MeetingAddEditTab2";
import { MeetingAddEditTab3 } from "./MeetingAddEditTab3";

export const MeetingAddEditPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const [active, setActive] = useState<number>(1);
    return (
        <Fragment>
            <AppBreadcrumb
                linkText={t("meetings.list:header.title")}
                linkUrl={"/meetings"}
            />
            <AppPageHeader
                title={t("meeting.form:header.title")}
            ></AppPageHeader>
            <div className="schedule-meeting--container mb-3">
                <div className="inner-content card">
                    <MeetingAddEditTabs
                        defaultActiveTab={1}
                        onChangeTab={(tab) => {
                            setActive(tab);
                        }}
                    />
                    <div
                        className="inner-content--steps tab-content"
                        id="myTabContent"
                    >
                        <MeetingAddEditTab1 active={active} />
                        <MeetingAddEditTab2 active={active} />
                        <MeetingAddEditTab3 active={active} />
                    </div>
                </div>
            </div>
        </Fragment>
    );
};
