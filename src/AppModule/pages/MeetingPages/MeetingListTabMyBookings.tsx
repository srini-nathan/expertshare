import React, { FC, Fragment } from "react";
import { useTranslation } from "react-i18next";

export const MeetingListTabMyBookings: FC = (): JSX.Element => {
    const { t } = useTranslation();
    return (
        <Fragment>
            <h1>{t("MeetingListTabMyBookings")}</h1>
        </Fragment>
    );
};
