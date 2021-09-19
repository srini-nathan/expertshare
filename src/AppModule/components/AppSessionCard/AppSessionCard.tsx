import React, { FC, useState } from "react";
import { Link } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Conference, Session, User } from "../../../AdminModule/models";
import { SessionPosterFileInfo } from "../../../config";
import { useBuildAssetPath, useDateTime } from "../../hooks";
import placeholder from "../../assets/images/imgthumb.svg";
import { getDateTimeWithoutTimezone, resolveImageWithStyle } from "../../utils";
import { AppUserListItem } from "../AppUserListItem";
import { AppShowUserListPopup } from "../AppShowUserListPopup";
import "./assets/scss/style.scss";

export interface AppSessionCardProps {
    data: Session;
}

export const AppSessionCard: FC<AppSessionCardProps> = ({
    data,
}): JSX.Element => {
    const { t } = useTranslation();
    const {
        id,
        title,
        imageName,
        sessionTags = [],
        description = "",
        start,
        speakers,
        moderators,
        conference,
    } = data;
    const { id: cId } = (conference as unknown) as Conference;
    const basePath = useBuildAssetPath(SessionPosterFileInfo);
    const style = resolveImageWithStyle(basePath, imageName, placeholder);
    const { toShortDate, toShortTime } = useDateTime();
    const [showMore, isShowMore] = useState<boolean>(false);
    const users = [...speakers, ...moderators];
    const limited = users?.slice(0, 3);

    return (
        <Col
            md={12}
            lg={4}
            xl={4}
            className="exhibitor-sessions-grid--container--item"
        >
            <AppShowUserListPopup
                show={showMore}
                handleClose={isShowMore}
                users={users as User[]}
            />
            <Col className="inner-container p-0 card">
                <Link to={`/event/${cId}/session/${id}`}>
                    <div
                        className="inner-container--banner"
                        style={style}
                    ></div>
                </Link>
                <div className="inner-container--det p-3 mx-2">
                    <Col className="inner-container--det--title p-0">
                        <Link to={`/event/${cId}/session/${id}`}>
                            <h2>{title}</h2>
                        </Link>
                    </Col>
                    <Col className="description mb-2 p-0">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: description,
                            }}
                        ></div>
                    </Col>
                    {start ? (
                        <Col className="inner-container--det--time p-0 my-1">
                            <div className="inner-container--det--time--icon mr-2">
                                <i className="fak fa-right"></i>
                            </div>
                            <div className="inner-container--det--time--spec">
                                {start && (
                                    <>
                                        <div className="inner-container--det--time--spec--date">
                                            <h3 className="mb-0">
                                                {toShortDate(
                                                    getDateTimeWithoutTimezone(
                                                        start
                                                    )
                                                )}
                                            </h3>
                                        </div>
                                        <div className="inner-container--det--time--spec--period">
                                            <span>
                                                {toShortTime(
                                                    getDateTimeWithoutTimezone(
                                                        start
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </Col>
                    ) : null}
                    <div className="inner-container--det--content my-3">
                        {users?.length > 0 && (
                            <>
                                <div className="inner-container--det--content--title">
                                    <h5>
                                        <i className="fak fa-speakers mr-2"></i>
                                        {t(
                                            "event.agenda:section.speakersandmoderators"
                                        )}
                                    </h5>
                                </div>
                                <div
                                    style={{
                                        overflow: "hidden",
                                    }}
                                    className="inner-container--det--content--speakers mt-3"
                                >
                                    {limited?.map((e: any, i: number) => {
                                        return (
                                            <AppUserListItem
                                                key={i}
                                                user={e as User}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="inner-container--det--content--more">
                                    {users.length > 3 && (
                                        <span
                                            onClick={() => {
                                                isShowMore(!showMore);
                                            }}
                                        >
                                            {showMore
                                                ? "- Show Less"
                                                : "+ Show More"}
                                        </span>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    {sessionTags?.length > 0 ? (
                        <Col className="conference-tags-container p-0 my-3">
                            <div className="conference-tags-container--title ">
                                <i className="fak fa-tags mr-2"></i>
                                <span>{t("event.form:label.tags")}</span>
                            </div>
                            <Row
                                className={
                                    "m-0 mt-3 p-0 conference-tags-container--tags"
                                }
                            >
                                {sessionTags?.map((e) => {
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
                    ) : null}
                </div>
            </Col>
        </Col>
    );
};
