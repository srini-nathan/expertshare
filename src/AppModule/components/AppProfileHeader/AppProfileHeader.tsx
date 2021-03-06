import React, { FC, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "@reach/router";
import { AppCard } from "../AppCard";
import { AppButton } from "../AppButton";
import { CONSTANTS } from "../../../config";
import "./assets/scss/style.scss";
import { useAuthState, useBuildAssetPath, useInitChat } from "../../hooks";
import placeholder from "../../assets/images/user-avatar.png";
import { FileTypeInfo } from "../../models";
import { useCheckFeature } from "../../hooks/useCheckFeature";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppProfileHeaderProps {
    id?: number;
    firstName?: string;
    lastName?: string;
    jobTitle?: string;
    company?: string;
    imageName?: string;
    isAllowCommunication?: boolean;
    isExposeEmail?: boolean;
    isProfilePage?: boolean;
    email?: string;
    userType?: string;
    userTags?: any[];
    userFieldValues?: any[];
}

export const AppProfileHeader: FC<AppProfileHeaderProps> = ({
    id,
    firstName,
    lastName,
    jobTitle,
    imageName,
    isAllowCommunication = true,
    isExposeEmail = true,
    isProfilePage = true,
    email,
    userTags,
    userType,
    company,
    userFieldValues,
}): JSX.Element => {
    const { t } = useTranslation();
    const { startChat } = useInitChat();
    const { user, containerId } = useAuthState();
    const { isChatEnable } = useCheckFeature();
    const getUserValue = (name: string): string => {
        let defaultValue = "";
        userFieldValues?.forEach((item: any) => {
            if (name === item.userField.fieldKey) defaultValue = item.value;
        });
        return defaultValue;
    };
    const [isReadMore, setIsReadMore] = useState(true);
    const showMore = () => {
        if (getUserValue("biography").length <= 500) return "";
        if (isReadMore) return "+Show More";
        return "-Show Less";
    };
    const profilePicturePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo,
        imageName
    );
    const style = imageName
        ? {
              backgroundImage: `url(${profilePicturePath})`,
              backgroundSize: "cover",
          }
        : {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
          };
    const getUserType = () => {
        switch (userType) {
            case "exhibitor":
                return (
                    <div className="badge-content">
                        <span className="speaker-btn">
                            <i
                                className="fak fa-speakers"
                                aria-hidden="true"
                            ></i>
                            <span>{t(`common.user.badge:${userType}`)}</span>
                        </span>
                    </div>
                );
            case "speaker":
                return (
                    <div className="badge-content">
                        <span className="speaker-btn">
                            <i
                                className="fak fa-speakers"
                                aria-hidden="true"
                            ></i>
                            <span>{t(`common.user.badge:${userType}`)}</span>
                        </span>
                    </div>
                );
            case "moderator":
                return (
                    <div className="badge-content">
                        <span className="speaker-btn">
                            <i
                                className="fak fa-speakers"
                                aria-hidden="true"
                            ></i>
                            <span>{t(`common.user.badge:${userType}`)}</span>
                        </span>
                    </div>
                );

            default:
                return <></>;
        }
    };
    return (
        <AppCard className="user-profile--det--container mb-3 pt-4 px-0">
            <Col className="inner-container p-0">
                {!isProfilePage && (
                    <Row className="m-0 p-0">
                        <Link
                            to={`/attendee`}
                            className="btn btn-secondary back-btn mx-4 mb-3"
                        >
                            <i className="fak fa-chevron-left mr-3"></i>
                            {t("common:label.back")}
                        </Link>
                    </Row>
                )}

                <Row className="m-0 p-0 detail-row mt-2">
                    <Col
                        md="auto"
                        className="inner-container--profile-pic pl-4 mt-5 mt-lg-0 mt-md-4 mt-sm-0"
                    >
                        <Col
                            style={style}
                            className="inner-container--profile-pic--content"
                        >
                            {userType && getUserType()}
                        </Col>
                    </Col>
                    <Col
                        md="auto"
                        className="inner-container--main-det mt-4 mt-xl-2 text-center text-md-left"
                    >
                        <Col className="inner-container--main-det--title p-0">
                            <h2>
                                {firstName && lastName
                                    ? `${firstName} ${lastName}`
                                    : ""}
                            </h2>
                        </Col>
                        <Col className="inner-container--main-det--major p-0">
                            <p className={"mb-0 job-title"}>{jobTitle || ""}</p>
                            <p>{company || ""}</p>
                        </Col>
                        <Col className="inner-container--main-det--mail p-0">
                            <span>{isExposeEmail && email}</span>
                        </Col>
                        <Col className="inner-container--main-det--tags mt-4 p-0">
                            <Col className="row m-0 p-0">
                                {userTags &&
                                    userTags.map((e, i) => {
                                        return (
                                            <Col
                                                key={i}
                                                className="inner-container--main-det--tags--item col-auto pl-0 mb-2 pr-2"
                                            >
                                                <a>{e.name}</a>
                                            </Col>
                                        );
                                    })}
                            </Col>
                        </Col>
                    </Col>
                    <Col
                        sm={12}
                        className="inner-container--main-det--biography mt-4 px-4"
                    >
                        <Col className="row m-0 p-0">
                            <p className={"user-biography"}>
                                {isReadMore
                                    ? getUserValue("biography").slice(0, 500)
                                    : getUserValue("biography")}
                                <span
                                    onClick={() => {
                                        setIsReadMore(!isReadMore);
                                    }}
                                    className="read-or-hide mt-2"
                                >
                                    {showMore()}
                                </span>
                            </p>
                        </Col>
                    </Col>
                    {!isProfilePage && (
                        <Col className="inner-container--right-btn col-auto mr-0 ml-auto pr-4 p-0">
                            <Col className="inner-container--right-btn--content p-0">
                                {isChatEnable() &&
                                    isAllowCommunication &&
                                    user && (
                                        <AppButton
                                            variant="secondary"
                                            className="get-contact-btn"
                                            onClick={() => {
                                                if (user.id && id) {
                                                    startChat(
                                                        id,
                                                        user.id,
                                                        containerId
                                                    );
                                                }
                                            }}
                                        >
                                            <i className="fak fa-start-conversation mb-1 mr-2"></i>
                                            {t(
                                                "attendee.form:button.startConversation"
                                            )}
                                        </AppButton>
                                    )}

                                {/* <AppButton
                                variant="secondary"
                                className="add-user-btn px-3 mr-2"
                            >
                                <i className="fak fa-user-plus-regular pr-2"></i>
                                Follow
                            </AppButton> */}
                            </Col>
                        </Col>
                    )}
                    <Col
                        md={12}
                        className="inner-container--portfolio  px-0 mt-4 portfolio-carousel"
                    >
                        <Col className="d-none inner-container--portfolio--content pt-4 px-0">
                            <Col className="inner-container--portfolio--content--item followers my-3 pl-3">
                                <Link to="#">
                                    <i className="fak fa-users pr-2"></i>
                                    <div className="det">
                                        <h3 className="mb-0">24</h3>
                                        <span>Followers</span>
                                    </div>
                                </Link>
                            </Col>
                            <Col className="inner-container--portfolio--content--item following my-3 pl-3">
                                <Link to="#">
                                    <i className="fak fa-user-plus-regular pr-2"></i>
                                    <div className="det">
                                        <h3 className="mb-0">30</h3>
                                        <span>Following</span>
                                    </div>
                                </Link>
                            </Col>
                            <Col className="inner-container--portfolio--content--item events my-3 pl-3">
                                <Link to="#">
                                    <i className="fak fa-th-large-regular pr-2"></i>
                                    <div className="det">
                                        <h3 className="mb-0">24</h3>
                                        <span>Favorite Events</span>
                                    </div>
                                </Link>
                            </Col>
                            <Col className="inner-container--portfolio--content--item sessions my-3 pl-3">
                                <Link to="#">
                                    <i className="fak fa-calendar-light pr-2"></i>
                                    <div className="det">
                                        <h3 className="mb-0">2</h3>
                                        <span>Favorite Sessions</span>
                                    </div>
                                </Link>
                            </Col>
                            <Col className="inner-container--portfolio--content--item containers my-3 pl-3">
                                <Link to="#">
                                    <i className="fak fa-map-signs-light pr-2"></i>
                                    <div className="det">
                                        <h3 className="mb-0">100</h3>
                                        <span>Favorite Containers</span>
                                    </div>
                                </Link>
                            </Col>
                            <Col className="inner-container--portfolio--content--item feeds my-3 pl-3">
                                <a href="#">
                                    <i className="fak fa-columns-regular pr-2"></i>
                                    <div className="det">
                                        <h3 className="mb-0">19</h3>
                                        <span>Feeds</span>
                                    </div>
                                </a>
                            </Col>
                            <div className="inner-container--portfolio--content--item favorite-feeds my-3 pl-3">
                                <a href="#">
                                    <i className="fak fa-columns-regular pr-2"></i>
                                    <div className="det">
                                        <h3 className="mb-0">12</h3>
                                        <span>Favorite Feeds</span>
                                    </div>
                                </a>
                            </div>
                        </Col>
                    </Col>
                </Row>
            </Col>
        </AppCard>
    );
};
