import React, { FC, useEffect, useState } from "react";
import { RouteComponentProps, useParams } from "@reach/router";
import "./assets/scss/booking.scss";
import { useTranslation } from "react-i18next";
import ReactDatePicker from "react-datepicker";
import { Meeting } from "../../models/entities/Meeting";
import { MeetingApi } from "../../apis/MeetingApi";
import { UserApi } from "../../../AdminModule/apis";
import { User } from "../../../AdminModule/models";
import { AppLoader, AppPageHeader } from "../../components";
import { useBuildAssetPath, useDateTime } from "../../hooks";
import { errorToast, parseIdFromResourceUrl, getBGStyle } from "../../utils";
import { UserProfileFileInfo } from "../../../config";
import placeholder from "../../assets/images/user-avatar.png";

export const MeetingBookingPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingUser, setLoadingUser] = useState<boolean>(true);
    const [found, setFound] = useState<boolean>(true);
    const [userId, setUserId] = useState<number>();
    const [user, setUser] = useState<User>();
    const [data, setData] = useState<Meeting>();
    const { t } = useTranslation();
    const basePath = useBuildAssetPath(UserProfileFileInfo);
    const [startDate, setStartDate] = useState<any>(new Date());
    const [duration, setDuration] = useState<string>();
    const { toShortDate } = useDateTime();

    const displayMinutes = (minutes: string): string => {
        const mins = parseInt(minutes, 10);
        return mins < 60
            ? minutes
            : `${Math.floor(mins / 60)}:${Math.floor(mins % 60)}`;
    };

    useEffect(() => {
        setLoading(true);
        MeetingApi.findById<Meeting>(id).then(({ isNotFound, response }) => {
            if (isNotFound) {
                setFound(false);
                errorToast(t("meeting.booking:notexit"));
            } else if (response) {
                setData(response);
                if (response.user) {
                    const uId = parseIdFromResourceUrl(response.user as string);
                    if (uId) {
                        setUserId(uId);
                    }
                }
            }
            setLoading(false);
        });
    }, [id, t]);

    useEffect(() => {
        setLoadingUser(true);
        if (userId) {
            UserApi.getAttendeeView<User>(userId).then(({ response }) => {
                if (response !== null) {
                    setUser(response);
                }
                setLoadingUser(false);
            });
        }
    }, [userId]);

    if (loading || loadingUser) {
        return <AppLoader />;
    }

    const profileStyle = getBGStyle(basePath, user?.imageName, placeholder);

    if (found === false) {
        return <AppPageHeader title={t("meeting:notexit")} />;
    }

    return (
        <div className="meeting-time-selection--container col-12 mb-3 px-0">
            <div className="inner-container card pt-4 pb-3">
                <div className="row m-0 p-0">
                    <div className="inner-container--profile-pic col-12 col-md-auto pl-4 mt-5 mt-md-0">
                        <div
                            className="inner-container--profile-pic--content"
                            style={profileStyle}
                        >
                            <a href="#" className="btn btn-info speaker-btn">
                                <i
                                    className="fak fa-speakers"
                                    aria-hidden="true"
                                ></i>
                                Speaker
                            </a>
                        </div>
                    </div>
                    <div className="inner-container--main-det col-12 col-md-auto mt-4 mt-xl-0 text-center text-md-left">
                        <div className="inner-container--main-det--title">
                            <a href="#">
                                <h2>
                                    {user?.firstName} {user?.lastName}
                                </h2>
                            </a>
                        </div>
                        <div className="inner-container--main-det--major">
                            <p>
                                {user?.jobTitle}{" "}
                                {user?.company ? `,${user?.company}` : ""}
                            </p>
                        </div>
                        <div className="inner-container--main-det--meeting-title">
                            <p>{data?.name}</p>
                        </div>
                        <div className="inner-container--main-det--desc">
                            <p>{data?.description}</p>
                        </div>
                    </div>

                    <div className="inner-container--time-selector col-12 p-4 mt-4">
                        <h2 className="title mb-3">
                            <i className="fak fa-check-circle-spec"></i>
                            {t(
                                "meeting.booking:title.chooseYourMeetingDayAndTime"
                            )}
                        </h2>
                        <div className="row">
                            <div className="col-12 col-lg-8">
                                <div className="card p-3 mb-2">
                                    <div className="row">
                                        <div className="col-12 col-xl-6 schedule-meeting--calendar my-3">
                                            <ReactDatePicker
                                                minDate={new Date()}
                                                selected={startDate}
                                                inline={true}
                                                onChange={(d) => {
                                                    if (d) {
                                                        setStartDate(d);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="col-12 col-xl-6 schedule-meeting--duration-selector my-3">
                                            <div className="schedule-meeting--duration-selector--duration mb-3">
                                                <div className="title">
                                                    <h2 className="text-center">
                                                        {t(
                                                            "meeting.booking:title.duration"
                                                        )}
                                                    </h2>
                                                </div>
                                                <div className="radio-btn-txt-seperated">
                                                    <div className="radio-btn-txt-seperated--container py-2 px-1">
                                                        {data?.duration.map(
                                                            (minutes) => {
                                                                return (
                                                                    <div
                                                                        className={`form-check text-center mr-2 duration ${
                                                                            duration ===
                                                                            minutes
                                                                                ? "active"
                                                                                : ""
                                                                        }`}
                                                                    >
                                                                        <label
                                                                            className={`form-check-label`}
                                                                            onClick={() => {
                                                                                setDuration(
                                                                                    minutes
                                                                                );
                                                                            }}
                                                                        >
                                                                            {displayMinutes(
                                                                                minutes
                                                                            )}
                                                                        </label>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inner-container--footer w-100 px-4 pt-4 pb-3">
                        <div className="row">
                            <div className="col-auto mr-auto ml-0 mr-md-0 ml-md-auto d-block d-md-flex">
                                <span className="title mr-4 mt-2">
                                    {t(
                                        "meeting.booking:title.meetingDayAndTime"
                                    )}
                                </span>
                                <span className="full-time mt-2">
                                    {toShortDate(startDate)} 01:15 - 01:45 PM
                                    {duration
                                        ? ` ( ${displayMinutes(duration)} ) `
                                        : null}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
