import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import "./assets/scss/booking.scss";
import { useTranslation } from "react-i18next";
import { MeetingApi } from "../../apis/MeetingApi";
import { Meeting } from "../../models/entities/Meeting";
import { errorToast, copyToClipBoard } from "../../utils";
import { AppLoader, AppPageHeader } from "../../components";

export const MeetingBookingConfirmPage: FC<RouteComponentProps> = ({
    navigate,
}): JSX.Element => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState<Meeting>();
    const [found, setFound] = useState<boolean>(true);
    useEffect(() => {
        setLoading(true);
        MeetingApi.findById<Meeting>(id).then(({ isNotFound, response }) => {
            if (isNotFound) {
                setFound(false);
                errorToast(t("meeting.booking:notexit"));
            } else if (response) {
                setData(response);
            }
            setLoading(false);
        });
    }, [id, t]);

    if (loading) {
        return <AppLoader />;
    }

    if (found === false) {
        return <AppPageHeader title={t("meeting:notexit")} />;
    }

    return (
        <div className="meeting-booked-successfully--content card p-4">
            <i className="fak fa-check-regular-bold success-icon"></i>
            <h3 className="title mt-4 mb-3 text-center">
                {t("meeting.bookingConfirm:youBookedMeeting")}
            </h3>
            <p className="topic text-center mb-3">{data?.name}</p>
            <p className="date text-center mb-3">26th June, 2021, 08:00 PM</p>
            <a
                href={data?.providerUrl}
                target="_blank"
                className="className-url text-center mb-4"
            >
                {data?.providerUrl}
            </a>
            <div className="row justify-content-center">
                <div className="col-auto px-0 mb-2">
                    <button
                        type="button"
                        className="btn btn-primary back-btn"
                        onClick={() => {
                            if (navigate) {
                                navigate("..");
                            }
                        }}
                    >
                        <i className="fak fa-chevron-left"></i>
                        {t("meeting.bookingConfirm:button.bak")}
                    </button>
                </div>
                <div className="col-auto mb-2">
                    <button
                        type="button"
                        className="btn btn-secondary copy-btn"
                        onClick={() => {
                            if (data?.providerUrl) {
                                copyToClipBoard(data?.providerUrl);
                            }
                        }}
                    >
                        {t("meeting.bookingConfirm:button.copy")}
                        <i className="fak fa-clone-light"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};
