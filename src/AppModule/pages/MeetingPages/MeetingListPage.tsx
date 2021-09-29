import React, { FC, Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "@reach/router";
import { MeetingListTabs } from "./MeetingListTabs";
import { AppPageHeader } from "../../components";
import { MeetingListTabMyBookings } from "./MeetingListTabMyBookings";
import { MeetingListTabMyMeetings } from "./MeetingListTabMyMeetings";

export const MeetingListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const [activeTab, setActiveTab] = useState<string>("my-meetings");
    const { t } = useTranslation();
    return (
        <Fragment>
            <AppPageHeader
                title={t("meetings.list:header.title")}
                createLink={"/meetings/create"}
                createLabel={"meeting.list:button.create"}
                showToolbar={activeTab === "my-meetings"}
                showSearchBar={false}
            ></AppPageHeader>
            <MeetingListTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />
            {activeTab === "my-bookings" ? (
                <MeetingListTabMyBookings />
            ) : (
                <MeetingListTabMyMeetings />
            )}
        </Fragment>
    );
};
