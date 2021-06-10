import React, { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Link } from "@reach/router";
import { Session, SessionCategory } from "../../../AdminModule/models";
import "./assets/scss/style.scss";
import { getTime } from "../../utils";
import { useBuildAssetPath } from "../../hooks";
import { CONSTANTS } from "../../../config";
import { AppButton } from "../AppButton";
import { AppCard } from "../AppCard";
import { FileTypeInfo } from "../../models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_SESSION_POSTER, FILETYPEINFO_USER_PROFILE },
} = UPLOAD;

export interface AppSessionItemProps {
    session: Session;
    conference: number;
    isGrantedControl: boolean;
    handleDelete: (id: number) => void;
}

export const AppSessionItem: FC<AppSessionItemProps> = ({
    session,
    conference,
    handleDelete,
    isGrantedControl,
}): JSX.Element => {
    const conferencePosterPath = useBuildAssetPath(
        FILETYPEINFO_SESSION_POSTER as FileTypeInfo
    );
    const userProfilePath = useBuildAssetPath(
        FILETYPEINFO_USER_PROFILE as FileTypeInfo
    );

    const [showMore, isShowMore] = useState<boolean>(false);

    const getSize = (): string[] => {
        switch (session.cardSize) {
            case "SMALL":
                return ["col-12", "small-size", "col-12", "col-12", "w-100"];
            case "MEDIUM":
                return ["col-12", "medium-size", "col-12", "col-12", "w-100"];
            case "LARGE":
                return ["col-12", "large-size", "col-12", "col-6", "w-100"];
            case "XLARGE":
                return ["col-12", "xlarge-size", "col-6", "col-12", "col-3"];
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
        return `${Math.floor(minutes)} mins`;
    };

    return (
        <Col className={`p-0 ${getSize()[0]}`}>
            <Col
                sm={12}
                className={`event-detail-admin--workshop--container--content--item py-2`}
            >
                <AppCard className={`inner-container p-0  ${getSize()[1]}`}>
                    <Row className="m-0 p-0">
                        <Col
                            sm={12}
                            className="inner-container--header pt-3 pb-2 px-3 px-2"
                            style={{
                                backgroundColor: getCategory().color,
                                color: getCategory().textColor,
                            }}
                        >
                            <Row className="m-0 p-0">
                                <Col
                                    sm={6}
                                    className="inner-container--header--time px-0"
                                >
                                    <i className="fak fa-clock-light"></i>
                                    <Col className="inner-container--header--time--content pl-3">
                                        <h2 className="mb-0">
                                            {getTime(session.start)}
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
                                    sm={6}
                                    className="inner-container--header--seats col-6 px-0"
                                >
                                    <i className="fak fa-seat"></i>
                                    <div className="inner-container--header--seats--content pl-3">
                                        <h2 className="mb-0">1150</h2>
                                        <span>Seats</span>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <div
                            className={`inner-container--banner ${
                                getSize()[2]
                            } px-0`}
                        >
                            <div
                                style={{
                                    backgroundImage: `url(${conferencePosterPath}/${session.imageName})`,
                                }}
                                className="inner-container--banner--content"
                            >
                                <div className="inner-container--banner--content--button">
                                    {/* <a href="#" className="live-now-btn mr-3">
                                    <i
                                        className="fak fa-live"
                                        aria-hidden="true"
                                    ></i>
                                    Live Now
                                </a> */}
                                </div>
                            </div>
                        </div>
                        <div
                            className={`inner-container--det ${
                                getSize()[4]
                            } p-3 mx-2`}
                        >
                            <div className="inner-container--det--title">
                                <Link to={`/sessions/${session.id}`}>
                                    <h2 className="mb-0">{session.title}</h2>
                                </Link>
                            </div>
                            <div className="inner-container--det--content mt-3">
                                <div className="inner-container--det--content--title">
                                    <i className="fak fa-speakers"></i>
                                    <h3 className="mb-0 pl-2">
                                        Speakers & Moderators
                                    </h3>
                                </div>
                                <div
                                    style={{
                                        overflow: showMore ? "auto" : "hidden",
                                    }}
                                    className="inner-container--det--content--speakers mt-3"
                                >
                                    {session.speakers.map((e: any) => {
                                        return (
                                            <div className="inner-container--det--content--speakers--item user-1 mt-2">
                                                <a href="#">
                                                    <div className="inner-container--det--content--speakers--item--profile pr-2">
                                                        <i
                                                            style={{
                                                                backgroundImage: `url(${userProfilePath}/${e.imageName})`,
                                                            }}
                                                        ></i>
                                                    </div>
                                                    <div className="inner-container--det--content--speakers--item--det">
                                                        <h4 className="name mb-0">
                                                            {e.firstName}{" "}
                                                            {e.lastName}
                                                        </h4>
                                                        <span className="major">
                                                            {e.jobTitle}
                                                        </span>
                                                    </div>
                                                </a>
                                            </div>
                                        );
                                    })}
                                    {session.moderators.map((e: any) => {
                                        return (
                                            <div className="inner-container--det--content--speakers--item user-1 mt-2">
                                                <a href="#">
                                                    <div className="inner-container--det--content--speakers--item--profile pr-2">
                                                        <i
                                                            style={{
                                                                backgroundImage: `url(${userProfilePath}/${e.imageName})`,
                                                            }}
                                                        ></i>
                                                    </div>
                                                    <div className="inner-container--det--content--speakers--item--det">
                                                        <h4 className="name mb-0">
                                                            {e.firstName}{" "}
                                                            {e.lastName}
                                                        </h4>
                                                        <span className="major">
                                                            {e.jobTitle}
                                                        </span>
                                                    </div>
                                                </a>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="inner-container--det--content--more">
                                    <span
                                        onClick={() => {
                                            isShowMore(!showMore);
                                        }}
                                    >
                                        {showMore ? " Show Less" : " Show More"}
                                    </span>
                                </div>
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
                                                    <div className="inner-container--det--action--other--item col-3">
                                                        <AppButton
                                                            variant={
                                                                "secondary"
                                                            }
                                                            className="btn-move btn-block "
                                                        >
                                                            <i className="fak fa-arrows-light"></i>
                                                        </AppButton>
                                                    </div>
                                                    <div className="inner-container--det--action--other--item col-3">
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
                                                    <div className="inner-container--det--action--other--item col-3">
                                                        <Link
                                                            to={`/sessions/${conference}/${session.id}`}
                                                            className="btn-edit btn btn-secondary mr-0 ml-auto"
                                                        >
                                                            <i className="fak fa-pen-regular"></i>
                                                        </Link>
                                                    </div>
                                                    <div className="inner-container--det--action--other--item col-3">
                                                        <AppButton
                                                            variant={
                                                                "secondary"
                                                            }
                                                            className="btn-copy  btn-block "
                                                        >
                                                            <i className="fak fa-clone-light"></i>
                                                        </AppButton>
                                                    </div>
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
