import React, { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Session, SessionCategory, User } from "../../../AdminModule/models";
import "./assets/scss/style.scss";
import placeholder from "../../assets/images/imgthumb.svg";
import { useBuildAssetPath } from "../../hooks";
import { CONSTANTS } from "../../../config";
import { AppButton } from "../AppButton";
import { AppCard } from "../AppCard";
import { AppUserListItem } from "../AppUserListItem";
import { FileTypeInfo } from "../../models";
import { useGlobalData } from "../../contexts";
import { humanReadableDate, getDateTimeWithoutTimezone } from "../../utils";
import { AppShowUserListPopup } from "../AppShowUserListPopup";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_SESSION_POSTER },
} = UPLOAD;

export interface AppSessionItemProps {
    session: Session;
    conference: number;
    isGrantedControl: boolean;
    sessionList: any[];
    handleDelete: (id: number) => void;
}

export const AppSessionItem: FC<AppSessionItemProps> = ({
    session,
    conference,
    handleDelete,
    isGrantedControl,
    sessionList,
}): JSX.Element => {
    const sessionPosterPath = useBuildAssetPath(
        FILETYPEINFO_SESSION_POSTER as FileTypeInfo,
        session.imageName
    );
    const styles = session?.imageName
        ? {
              backgroundImage: `url(${sessionPosterPath})`,
          }
        : {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "inherit",
              backgroundPosition: "center",
          };
    const [showMore, isShowMore] = useState<boolean>(false);
    const { container } = useGlobalData();
    const { t } = useTranslation();
    const users = [...session.speakers, ...session.moderators];
    const limited = users?.slice(0, 3);

    const getSize = (): string[] => {
        switch (session.cardSize) {
            case "SMALL":
                return ["col-12", "small-size", "col-12", "col-12", "w-100"];
            case "MEDIUM":
                return ["col-12", "medium-size", "col-12", "col-12", "w-100"];
            case "LARGE":
                return ["col-12", "large-size", "col-12", "col-6", "w-100"];
            case "XLARGE":
                return [
                    "col-12",
                    "xlarge-size",
                    "col-xl-6 col-lg-6 col-12",
                    "col-12",
                    "col-xl-3 col-lg-6 col-12",
                ];
            default:
                return ["col-12", "small-size", "col-12", "col-12", "w-100"];
        }
    };

    const getCategory = () => {
        const sessionCategory: SessionCategory = session.sessionCategory as SessionCategory;
        return {
            color: sessionCategory.color,
            name: sessionCategory.name,
            textColor: sessionCategory.textColor,
        };
    };

    const getDiffTime = () => {
        const start = new Date(session.start);
        const end = new Date(session.end);
        let diff = Math.abs(start.getTime() - end.getTime()) / 1000;
        const days = Math.floor(diff / 86400);
        diff -= days * 86400;
        const hours = Math.floor(diff / 3600) % 24;
        diff -= hours * 3600;
        const minutes = Math.floor(diff / 60) % 60;
        diff -= minutes * 60;

        if (hours > 0)
            return ` ${hours}:${minutes} ${hours > 1 ? "hours" : "hour"}`;
        return ` ${Math.floor(minutes)} mins`;
    };

    return (
        <Col className={`p-0 ${getSize()[0]}`}>
            <Col
                sm={12}
                className={`event-detail-admin--workshop--container--content--item p-0 ${
                    getSize()[1]
                }`}
            >
                <AppShowUserListPopup
                    show={showMore}
                    handleClose={isShowMore}
                    users={users as User[]}
                />
                <AppCard className={`inner-container p-0`}>
                    <Row className="m-0 p-0">
                        <Col
                            sm={12}
                            className="inner-container--header pt-3 pb-2 px-3 px-2"
                            style={{
                                backgroundColor: getCategory().color,
                                color: getCategory().textColor,
                            }}
                        >
                            <Link
                                to={`/event/${conference}/session/${session.id}`}
                                state={{ sessionList }}
                                style={{
                                    backgroundColor: getCategory().color,
                                    color: getCategory().textColor,
                                }}
                            >
                                <Row className="m-0 p-0">
                                    <Col
                                        sm={9}
                                        className="inner-container--header--time px-0"
                                    >
                                        <i className="fak fa-clock-light"></i>
                                        <Col className="inner-container--header--time--content pl-3">
                                            <h2 className="mb-0">
                                                {humanReadableDate(
                                                    getDateTimeWithoutTimezone(
                                                        session.start
                                                    ),
                                                    container &&
                                                        container.configuration &&
                                                        (container.configuration as any)
                                                            .shortTime
                                                        ? (container.configuration as any)
                                                              .shortTime
                                                        : "hh:mm a"
                                                )}
                                                <span className="value">
                                                    {getDiffTime()}
                                                </span>
                                            </h2>
                                            <span className="desc">
                                                {getCategory().name}
                                            </span>
                                        </Col>
                                    </Col>
                                    <Col
                                        sm={4}
                                        className="inner-container--header--seats col-6 px-0"
                                    >
                                        {/* <i className="fak fa-seat"></i> */}
                                        <div className="inner-container--header--seats--content pl-3">
                                            {/* <h2 className="mb-0">1150</h2> */}
                                            {/* <span>Seats</span> */}
                                        </div>
                                    </Col>
                                </Row>
                            </Link>
                        </Col>
                        <div
                            className={`inner-container--banner ${
                                getSize()[2]
                            } px-0`}
                        >
                            <Link
                                to={`/event/${conference}/session/${session.id}`}
                                state={{ sessionList }}
                            >
                                <div
                                    style={styles}
                                    className="inner-container--banner--content"
                                >
                                    <div className="inner-container--banner--content--button">
                                        {session.isLive && (
                                            <span className="live-now-btn mr-3">
                                                <i
                                                    className="fak fa-live"
                                                    aria-hidden="true"
                                                ></i>
                                                {t(
                                                    "sessionDetails:label.liveNow"
                                                )}
                                            </span>
                                        )}
                                        {session.isArchive && (
                                            <span className="archived-btn mr-3">
                                                <i className="far fa-archive"></i>
                                                {t(
                                                    "sessionDetails:label.archived"
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div
                            className={`inner-container--det ${
                                getSize()[4]
                            } p-3 mx-2`}
                        >
                            <div className="inner-container--det--title">
                                <Link
                                    to={`/event/${conference}/session/${session.id}`}
                                    state={{ sessionList }}
                                >
                                    <h2 className="mb-0">{session.title}</h2>
                                </Link>
                            </div>
                            <div className="inner-container--det--content mt-3">
                                {users?.length > 0 && (
                                    <>
                                        <div className="inner-container--det--content--title">
                                            <i className="fak fa-speakers"></i>
                                            <h3 className="mb-0 pl-2">
                                                {t(
                                                    "event.agenda:section.speakersandmoderators"
                                                )}
                                            </h3>
                                        </div>
                                        <div
                                            style={{
                                                overflow: "hidden",
                                            }}
                                            className="inner-container--det--content--speakers mt-3"
                                        >
                                            {limited?.map(
                                                (e: any, i: number) => {
                                                    return (
                                                        <AppUserListItem
                                                            key={i}
                                                            user={e as User}
                                                        />
                                                    );
                                                }
                                            )}
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
                            <div className="inner-container--det--action col-12 mt-3 px-0">
                                <div className="row">
                                    {/* <div className={`${getSize()[3]}`}> */}
                                    {/* <div className="inner-container--det--action--join mb-2">
                                            <a
                                                href="#"
                                                className="btn btn-secondary"
                                            >
                                                <i className="fak fa-check-circle-regular"></i>
                                                Join
                                            </a>
                                        </div> */}
                                    {/* </div> */}
                                    {isGrantedControl && (
                                        <div className={`${getSize()[3]}`}>
                                            <div className="inner-container--det--action--other">
                                                <div className="row">
                                                    {/* <div className="inner-container--det--action--other--item col-3">
                                                        <AppButton
                                                            variant={
                                                                "secondary"
                                                            }
                                                            className="btn-move btn-block "
                                                        >
                                                            <i className="fak fa-arrows-light"></i>
                                                        </AppButton>
                                                    </div> */}
                                                    <div className="inner-container--det--action--other--item col-6">
                                                        <AppButton
                                                            onClick={() =>
                                                                handleDelete(
                                                                    session.id
                                                                )
                                                            }
                                                            variant={
                                                                "secondary"
                                                            }
                                                            className="btn-tras  btn-block"
                                                        >
                                                            <i className="fak fa-trash-light"></i>
                                                        </AppButton>
                                                    </div>
                                                    <div className="inner-container--det--action--other--item col-6">
                                                        <Link
                                                            to={`/event/${conference}/session/${session.id}/update`}
                                                            className="btn-edit btn btn-secondary mr-0 ml-auto"
                                                        >
                                                            <i className="fak fa-pen-regular"></i>
                                                        </Link>
                                                    </div>
                                                    {/* <div className="inner-container--det--action--other--item col-3">
                                                        <AppButton
                                                            variant={
                                                                "secondary"
                                                            }
                                                            className="btn-copy  btn-block "
                                                        >
                                                            <i className="fak fa-clone-light"></i>
                                                        </AppButton>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Row>
                </AppCard>
            </Col>
        </Col>
    );
};
