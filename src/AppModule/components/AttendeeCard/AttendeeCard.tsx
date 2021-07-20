import React, { FC, useState } from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import "./assets/scss/list.scss";
import { useAuthState, useBuildAssetPath, useInitChat } from "../../hooks";
import { CONSTANTS } from "../../../config";
import { FileTypeInfo, User } from "../../models";
import placeholder from "../../assets/images/user-avatar.png";
import { useCheckFeature } from "../../hooks/useCheckFeature";
import { useGlobalData } from "../../contexts";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AttendeeCardProps {
    attendee: any;
}

export const AttendeeCard: FC<AttendeeCardProps> = ({
    attendee,
}): JSX.Element => {
    const [online] = useState(false);
    const { t } = useTranslation();

    const {
        imageName,
        firstName,
        lastName,
        jobTitle,
        company,
        email,
        isExposeEmail,
        isAllowCommunication,
        userTags,
        userType,
        id,
    } = attendee as User;
    const profilePicturePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        imageName
    );
    const { container } = useGlobalData();
    const { startChat } = useInitChat();
    const { user } = useAuthState();
    const { isChatEnable } = useCheckFeature();

    const style = imageName
        ? {
              backgroundImage: `url(${profilePicturePath})`,
              backgroundSize: "cover",
          }
        : {
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url(${placeholder})`,
          };

    const getUserType = () => {
        switch (userType) {
            case "exhibitor":
                return (
                    <span className="speaker-btn">
                        <i className="fak fa-speakers" aria-hidden="true"></i>
                        <span>{t(`common.user.badge:${userType}`)}</span>
                    </span>
                );
            case "speaker":
                return (
                    <span className="speaker-btn">
                        <i className="fak fa-speakers" aria-hidden="true"></i>
                        <span>{t(`common.user.badge:${userType}`)}</span>
                    </span>
                );
            case "moderator":
                return (
                    <span className="speaker-btn">
                        <i className="fak fa-speakers" aria-hidden="true"></i>
                        <span>{t(`common.user.badge:${userType}`)}</span>
                    </span>
                );

            default:
                return <></>;
        }
    };

    return (
        <div className="card p-3">
            <div className="card--icons">
                <div className="card--icons--favorite">
                    {/* <a href="#" className="btn btn-secondary">
                        <AppIcon name="AddUserPlus" />
                    </a> */}
                </div>
            </div>
            <div className="card--avatar mt-3">
                <Link
                    to={`/attendee/${attendee.id}/show`}
                    className={
                        online ? "profile-avatar online" : "profile-avatar"
                    }
                >
                    <i style={style}></i>
                </Link>
                {userType && getUserType()}
            </div>
            <div className="card--title text-center mt-3">
                <Link
                    to={`/attendee/${attendee.id}/show`}
                    className={"card--title--name"}
                >
                    <h2>
                        {firstName} {lastName}
                    </h2>
                </Link>
                <div className="card--title--bio mb-1 mx-2">
                    <p className={"job-title mb-0"}>{jobTitle || ""}</p>
                    <p>{company || ""}</p>
                </div>
                <a className="card--title--mail mb-3 d-block">
                    {isExposeEmail && email}
                </a>
            </div>
            {userTags && (
                <div className="card--tags">
                    <div className="row m-0 p-0">
                        {userTags.map((tag, index: any) => {
                            if (index < 3) {
                                return (
                                    <div
                                        className="card--tags--item col-auto px-0 mb-2"
                                        key={index}
                                    >
                                        <a>{tag.name}</a>
                                    </div>
                                );
                            }

                            return <></>;
                        })}
                        {/* {userTags.length > 2 && (
                            <div className="card--tags--item show-more col-auto px-0 mb-2">
                                <a href="#">+ Show More</a>
                            </div>
                        )} */}
                    </div>
                </div>
            )}
            <div className="card--buttons mt-3 mb-2">
                <div className="row m-0 p-0">
                    {/* <div className="card--buttons--book-session col-6 px-2">
                        <button className="btn btn-secondary">
                            <AppIcon name="CalendarPlus" />
                            Book Session
                        </button>
                    </div> */}
                    <div className="card--buttons--get-in-contact col-12 px-2">
                        <button className="btn btn-secondary">
                            <i className="fak fa-start-conversation"></i>
                            {t("attendee.form:button.getInContact")}
                            <div className="popup">
                                <div className="popup--inner">
                                    {/* <div className="popup--inner--item video-chat">
                                        <a href="#">
                                            <AppIcon name={"Video"} />
                                            Start Video Chat
                                        </a>
                                    </div> */}
                                    {isChatEnable() &&
                                        isAllowCommunication &&
                                        container &&
                                        user && (
                                            <div
                                                className="popup--inner--item conversation"
                                                onClick={() => {
                                                    if (user.id) {
                                                        startChat(
                                                            user.id,
                                                            id,
                                                            container.id
                                                        );
                                                    }
                                                }}
                                            >
                                                <a>
                                                    <i className="fak fa-start-conversation"></i>
                                                    {t(
                                                        "attendee.form:button.startConversation"
                                                    )}
                                                </a>
                                            </div>
                                        )}
                                    <div className="popup--inner--item view-profile">
                                        <Link
                                            to={`/attendee/${attendee.id}/show`}
                                            className={
                                                online
                                                    ? "profile-avatar online"
                                                    : "profile-avatar"
                                            }
                                        >
                                            <i className="fak fa-view-profile"></i>
                                            {t(
                                                "attendee.form:button.viewProfile"
                                            )}
                                        </Link>
                                    </div>
                                    {/* <div className="popup--inner--item view-profile">
                                        <a href="#">
                                            <AppIcon name="Download" />
                                            Download VCF
                                        </a>
                                    </div> */}
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
