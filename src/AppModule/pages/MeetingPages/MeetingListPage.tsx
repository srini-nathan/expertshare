import React, { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps, useParams } from "@reach/router";
import { MeetingListTabs } from "./MeetingListTabs";
import { AppPageHeader } from "../../components";

export const MeetingListPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { tab = "my-meetings" } = useParams();
    const { t } = useTranslation();
    return (
        <Fragment>
            <AppPageHeader
                title={t("meetings.list:header.title")}
                createLink={""}
            ></AppPageHeader>
            <MeetingListTabs activeTab={tab} setActiveTab={() => {}} />
        </Fragment>
    );
};
