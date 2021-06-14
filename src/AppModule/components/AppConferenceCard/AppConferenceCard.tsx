import React, { FC } from "react";
import { format } from "date-fns";
import { Link } from "@reach/router";
import { Col, Row } from "react-bootstrap";
import { PConference } from "../../../AdminModule/models";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import "./assets/scss/style.scss";
import placeholder from "./assets/images/imgthumb.svg";
import { FileTypeInfo } from "../../models";
import { useGlobalData } from "../../contexts";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_CONFERENCE_POSTER },
} = UPLOAD;

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
    const {
        id,
        title,
        startAt,
        imageName = "",
        conferenceTags = [],
        description,
    } = conference;

    const { container } = useGlobalData();

    const imagePath = useBuildAssetPath(
        FILETYPEINFO_CONFERENCE_POSTER as FileTypeInfo,
        imageName
    );
    const style = imageName
        ? {
              backgroundImage: `url(${imagePath})`,
          }
        : {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "inherit",
              backgroundPosition: "center",
          };

    return (
        <Col md={12} lg={4} xl={4} className="events-grid--container--item">
            <Col className="inner-container p-0">
                <div className="inner-container--banner p-0" style={style}>
                    {/* <div className="inner-container--banner--button">
                        <a href="#" className="live-now-btn mr-3">
                            <i className="fak fa-live"></i>
                            Live Now
                        </a>
                    </div> */}
                    <div className="inner-container--banner--icons ">
                        {isGrantedControl && (
                            <>
                                <span onClick={() => handleClone(id as number)}>
                                    <i className="far fa-clone"></i>
                                </span>
                                <Link to={`/event/${id}/update`}>
                                    <i className="fak fa-pen-regular"></i>
                                </Link>
                                <span
                                    onClick={() => handleDelete(id as number)}
                                >
                                    <i className="fak fa-trash-light"></i>
                                </span>
                            </>
                        )}
                    </div>
                </div>

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
                                            {format(
                                                new Date(startAt),
                                                container &&
                                                    container.configuration &&
                                                    (container.configuration as any)
                                                        .shortDate
                                                    ? (container.configuration as any)
                                                          .shortDate
                                                    : "EEEE MMMM, dd"
                                            )}
                                        </h3>
                                    </div>
                                    <div className="inner-container--det--time--spec--period">
                                        <span>
                                            {format(
                                                new Date(startAt),
                                                container &&
                                                    container.configuration &&
                                                    (container.configuration as any)
                                                        .shortTime
                                                    ? (container.configuration as any)
                                                          .shortTime
                                                    : "hh:mm a"
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
                                    <span>Tags</span>
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
                    <Col className="description mb-2 p-0">{description}</Col>

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
                {/* <div className="inner-container--sponsors px-3 pt-3 pb-3">
                    <h3 className="mb-0 pl-2 pt-1">
                        <i className="fak fa-handshake-alt-light mr-2"></i>
                        Sponsors
                    </h3>
                    <div className="inner-container--sponsors--carousel mt-1 sponsor-carousel">
                        <div className="inner-container--sponsors--carousel--group mt-1">
                            <div className="inner-container--sponsors--carousel--item sponsor-1 mr-2">
                                <div className="inner-container--sponsors--carousel--item--logo">
                                    <a>
                                        <i></i>
                                    </a>
                                </div>
                            </div>
                            <div className="inner-container--sponsors--carousel--item sponsor-2 mr-2">
                                <div className="inner-container--sponsors--carousel--item--logo">
                                    <a>
                                        <i></i>
                                    </a>
                                </div>
                            </div>
                            <div className="inner-container--sponsors--carousel--item sponsor-3 mr-2">
                                <div className="inner-container--sponsors--carousel--item--logo">
                                    <a>
                                        <i></i>
                                    </a>
                                </div>
                            </div>
                            <div className="inner-container--sponsors--carousel--item sponsor-1 mr-2">
                                <div className="inner-container--sponsors--carousel--item--logo">
                                    <a>
                                        <i></i>
                                    </a>
                                </div>
                            </div>
                            <div className="inner-container--sponsors--carousel--item sponsor-2 mr-2">
                                <div className="inner-container--sponsors--carousel--item--logo">
                                    <a>
                                        <i></i>
                                    </a>
                                </div>
                            </div>
                            <div className="inner-container--sponsors--carousel--item sponsor-3 mr-2">
                                <div className="inner-container--sponsors--carousel--item--logo">
                                    <a>
                                        <i></i>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           */}
            </Col>
        </Col>
    );
};
