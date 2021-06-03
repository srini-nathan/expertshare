import React, { FC } from "react";
import { Link } from "@reach/router";
import { Col } from "react-bootstrap";
import { PConference } from "../../../AdminModule/models";
import "./assets/scss/style.scss";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import { getDate, getTime } from "../../utils";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_CONFERENCE_POSTER },
} = UPLOAD;

const { path } = FILETYPEINFO_CONFERENCE_POSTER;

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
        startedAt,
        imageName = "",
        conferenceTags = [],
        description,
    } = conference;
    const imagePath = useBuildAssetPath(path, imageName);

    return (
        <Col md={12} lg={4} xl={4} className="events-grid--container--item">
            <div className="inner-container  ">
                <div
                    className="inner-container--banner"
                    style={{
                        backgroundImage: `url(${imagePath})`,
                    }}
                >
                    {/* <div className="inner-container--banner--button">
                        <a href="#" className="live-now-btn mr-3">
                            <i className="fak fa-live"></i>
                            Live Now
                        </a>
                    </div> */}
                    <div className="inner-container--banner--icons">
                        {isGrantedControl && (
                            <>
                                <span onClick={() => handleClone(id as number)}>
                                    <i className="far fa-clone"></i>
                                </span>
                                <span
                                    onClick={() => handleDelete(id as number)}
                                >
                                    <i className="fak fa-trash-light"></i>
                                </span>
                                <Link to={`/conference/${id}`}>
                                    <i className="fak fa-pen-regular"></i>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
                <div className="inner-container--det p-3 mx-2">
                    <div className="inner-container--det--title">
                        <a href="#">
                            <h2>{title}</h2>
                        </a>
                    </div>
                    <div className="description">{description}</div>
                    <div
                        className={
                            "row m-0 mt-3 p-0 justify-content-center conference-tags-container"
                        }
                    >
                        {conferenceTags.map((e) => {
                            return (
                                <div className={"conference-tags"} key={e.id}>
                                    {e.name}
                                </div>
                            );
                        })}
                    </div>
                    <div className="inner-container--det--time my-3">
                        <div className="inner-container--det--time--icon mr-2">
                            {startedAt && <i className="fak fa-right"></i>}
                        </div>
                        <div className="inner-container--det--time--spec">
                            {startedAt && (
                                <>
                                    <div className="inner-container--det--time--spec--date">
                                        <h3 className="mb-0">
                                            {getDate(startedAt).toString()}
                                        </h3>
                                    </div>
                                    <div className="inner-container--det--time--spec--period">
                                        <span>{getTime(startedAt)}</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
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
            </div>
        </Col>
    );
};
