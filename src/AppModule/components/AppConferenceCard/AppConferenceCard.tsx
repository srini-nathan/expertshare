import React, { FC } from "react";
import { Link } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { PConference } from "../../../AdminModule/models";
import {
    ExhibitorLogoPosterFileInfo,
    ConferencePosterFileInfo,
} from "../../../config";
import { useAuthState, useBuildAssetPath, useDateTime } from "../../hooks";
import placeholder from "../../assets/images/imgthumb.svg";
import { getDateTimeWithoutTimezone, resolveImageWithStyle } from "../../utils";
import { AppSponsors } from "../AppSponsors";
import "./assets/scss/style.scss";

export interface AppConferenceCardProps {
    conference: PConference;
    isGrantedControl?: boolean;
    handleDelete: (id: number) => void;
    handleClone: (id: number) => void;
}

export const AppConferenceCard: FC<AppConferenceCardProps> = ({
    conference,
    handleClone,
    handleDelete,
    isGrantedControl,
}): JSX.Element => {
    const { t } = useTranslation();
    const {
        id,
        title,
        startAt,
        imageName = "",
        conferenceTags = [],
        description,
        isLive,
        isArchive,
        exhibitors = [],
    } = conference;

    const { containerId } = useAuthState();

    const basePath = useBuildAssetPath(ConferencePosterFileInfo);
    const exhibitorLogoBasePath = useBuildAssetPath(
        ExhibitorLogoPosterFileInfo
    );
    const style = resolveImageWithStyle(basePath, imageName, placeholder);
    const { toShortDate, toShortTime } = useDateTime();

    return (
        <Col md={12} lg={4} xl={3} className="events-grid--container--item">
            <Col className="inner-container p-0 card">
                <Link to={`/event/${id}/agenda`}>
                    <div className="inner-container--banner" style={style}>
                        <div className="inner-container--banner--button">
                            {isLive ? (
                                <span className="live-now-btn mr-3">
                                    <i className="fak fa-live"></i>
                                    {t("event.list:badge.livenow")}
                                </span>
                            ) : null}
                            {isArchive ? (
                                <span className="archived-btn mr-3">
                                    <i className="fak fa-archive-regular"></i>
                                    {t("event.list:badge.archived")}
                                </span>
                            ) : null}
                        </div>

                        <div className="inner-container--banner--icons ">
                            {isGrantedControl && (
                                <>
                                    <Link
                                        to={"#"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleClone(id as number);
                                        }}
                                    >
                                        <i className="far fa-clone"></i>
                                    </Link>
                                    <Link to={`/event/${id}/update`}>
                                        <i className="fak fa-pen-regular"></i>
                                    </Link>
                                    <Link
                                        to={"#"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(id as number);
                                        }}
                                    >
                                        <i className="fak fa-trash-light"></i>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </Link>
                <div className="inner-container--det p-3 mx-2">
                    <Col className="inner-container--det--title p-0">
                        <Link to={`/event/${id}/agenda`}>
                            <h2>{title}</h2>
                        </Link>
                    </Col>
                    <Col className="inner-container--det--time p-0 my-3">
                        <div className="inner-container--det--time--icon mr-2">
                            {startAt && <i className="fak fa-right"></i>}
                        </div>
                        <div className="inner-container--det--time--spec">
                            {startAt && (
                                <>
                                    <div className="inner-container--det--time--spec--date">
                                        <h3 className="mb-0">
                                            {toShortDate(
                                                getDateTimeWithoutTimezone(
                                                    startAt
                                                )
                                            )}
                                        </h3>
                                    </div>
                                    <div className="inner-container--det--time--spec--period">
                                        <span>
                                            {toShortTime(
                                                getDateTimeWithoutTimezone(
                                                    startAt
                                                )
                                            )}
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                    <Col className="conference-tags-container p-0 my-3">
                        <div className="conference-tags-container--title ">
                            {conferenceTags.length > 0 && (
                                <>
                                    <i className="fak fa-tags mr-2"></i>
                                    <span>{t("event.form:label.tags")}</span>
                                </>
                            )}
                        </div>
                        <Row
                            className={
                                "m-0 mt-3 p-0 conference-tags-container--tags"
                            }
                        >
                            {conferenceTags.map((e) => {
                                return (
                                    <div
                                        className={"conference-tags"}
                                        key={e.id}
                                    >
                                        {e.name}
                                    </div>
                                );
                            })}
                        </Row>
                    </Col>
                    <Col className="description mb-2 p-0">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: description || "",
                            }}
                        ></div>
                    </Col>

                    {/* <div className="inner-container--det--participants">
                        <div className="inner-container--det--participants--icon mr-2">
                            <i className="fak fa-speakers"></i>
                        </div>
                        <div className="inner-container--det--participants--content">
                            <div className="inner-container--det--participants--content--title">
                                <h3 className="mb-0">Speakers & Moderators</h3>
                            </div>
                            <div className="inner-container--det--participants--content--user mt-3">
                                <div className="inner-container--det--participants--content--user--item user-1 mb-3">
                                    <div className="inner-container--det--participants--content--user--item--avatar mr-2">
                                        <a href="#">
                                            <i></i>
                                        </a>
                                    </div>
                                    <div className="inner-container--det--participants--content--user--item--info">
                                        <a href="#">
                                            <h4 className="mb-0">
                                                Arlene McCoy
                                            </h4>
                                            <span>
                                                Product Development @Snapchat
                                            </span>
                                        </a>
                                    </div>
                                </div>
                                <div className="inner-container--det--participants--content--user--item user-2 mb-3">
                                    <div className="inner-container--det--participants--content--user--item--avatar mr-2">
                                        <a href="#">
                                            <i></i>
                                        </a>
                                    </div>
                                    <div className="inner-container--det--participants--content--user--item--info">
                                        <a href="#">
                                            <h4 className="mb-0">
                                                Janne Cooper
                                            </h4>
                                            <span>CTO at @Uber</span>
                                        </a>
                                    </div>
                                </div>
                                <div className="inner-container--det--participants--content--user--item user-3 mb-1">
                                    <div className="inner-container--det--participants--content--user--item--avatar mr-2">
                                        <a href="#">
                                            <i></i>
                                        </a>
                                    </div>
                                    <div className="inner-container--det--participants--content--user--item--info">
                                        <a href="#">
                                            <h4 className="mb-0">
                                                Leslie Alexander
                                            </h4>
                                            <span>
                                                Product Management @Schnier
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="inner-container--det--participants--content--more">
                                <a href="#">+ Show More</a>
                            </div>
                        </div>
                    </div>
                */}
                </div>
                <div className="inner-container--sponsors">
                    {exhibitors.length > 0 ? (
                        <div className="content px-3 pt-3 pb-3">
                            <h3 className="mb-0 pl-2 pt-1">
                                <i className="fak fa-handshake-alt-light mr-2"></i>
                                {t("event.list:label.sponsors")}
                            </h3>
                            <div className="inner-container--sponsors--carousel mt-1 sponsor-carousel">
                                <div className="inner-container--sponsors--carousel--group mt-1">
                                    <AppSponsors
                                        data={
                                            (conference?.exhibitors as unknown) as string[]
                                        }
                                        basePath={exhibitorLogoBasePath}
                                        options={{
                                            slidesPerView: "auto",
                                        }}
                                        containerId={containerId}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </Col>
        </Col>
    );
};
