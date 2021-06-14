import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { AppCard } from "../AppCard";
import { AppSessionTags } from "../AppSessionTags";
import "./assets/scss/style.scss";
import { Session, SessionCategory } from "../../../AdminModule/models";

export interface AppSessionDetailsProps {
    session: Session;
}

export const AppSessionDetails: FC<AppSessionDetailsProps> = ({
    session,
}): JSX.Element => {
    return (
        <AppCard>
            <Row className="m-0 mb-3 mb-lg-4">
                <Col md={6} className="session-details-info my-4 px-4">
                    <h2>
                        <i className="fak fa-session-details"></i>
                        Session Details
                    </h2>
                    <div className="session-details-info--container mt-4">
                        <Row className="m-0 p-0">
                            <Col
                                sm={6}
                                className="session-details-info--container--item px-0 pb-3"
                            >
                                <span>
                                    <i className="fak fa-seat"></i>
                                    56/120 Seats
                                </span>
                            </Col>
                            {session.isJoinRequired && (
                                <Col
                                    sm={6}
                                    className="session-details-info--container--item px-0 pb-3"
                                >
                                    <span>
                                        <i className="fak fa-icn-user-check"></i>
                                        Mandatory
                                    </span>
                                </Col>
                            )}

                            <Col
                                sm={6}
                                className="session-details-info--container--item px-0 pb-3"
                            >
                                <span>
                                    <i className="fak fa-icon-map"></i>
                                    Canteene
                                </span>
                            </Col>
                            <Col
                                sm={6}
                                className="session-details-info--container--item px-0 pb-3"
                            >
                                <span>
                                    <i className="fak fa-icn-food"></i>
                                    {
                                        (session.sessionCategory as SessionCategory)
                                            .name
                                    }
                                </span>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col
                    md={6}
                    className="session-details-share my-0 my-md-4 pl-4 pl-md-5 pr-4"
                >
                    <h2>
                        <i className="fak fa-like-share"></i>
                        Like & Share
                    </h2>
                    <div className="session-details-share--container mt-1">
                        <div className="row m-0 p-0">
                            <div className="session-details-share--container--item like col-auto pl-0 mt-2">
                                <button>
                                    <i className="fak fa-hearts"></i>
                                    <span>1293</span>
                                    Likes
                                </button>
                            </div>
                            <div className="session-details-share--container--item share col-auto pl-0 mt-2">
                                <button>
                                    <i className="fak fa-share-alt"></i>
                                    Share
                                    <div className="share--popup">
                                        <div className="share--popup--container w-100">
                                            <div className="row m-0 p-0">
                                                <div className="share--popup--container--socials col-12 col-sm-6 pr-0">
                                                    <div className="row m-0 p-0">
                                                        <div className="share--popup--container--socials--item linkedin col-auto col-sm-3 p-0">
                                                            <a href="#">
                                                                <i></i>
                                                            </a>
                                                        </div>
                                                        <div className="share--popup--container--socials--item facebook col-auto col-sm-3 p-0">
                                                            <a href="#">
                                                                <i></i>
                                                            </a>
                                                        </div>
                                                        <div className="share--popup--container--socials--item twitter col-auto col-sm-3 p-0">
                                                            <a href="#">
                                                                <i></i>
                                                            </a>
                                                        </div>
                                                        <div className="share--popup--container--socials--item instagram col-auto col-sm-3 p-0">
                                                            <a href="#">
                                                                <i></i>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="share--popup--container--link col-12 col-sm-6 pl-0">
                                                    <div className="share--popup--container--link--inner-box w-100">
                                                        <form className="w-100">
                                                            <input
                                                                type="text"
                                                                className="w-100"
                                                                placeholder="https://www.flaticon.com..."
                                                                disabled
                                                            />
                                                            <i className="fak fa-clone-light"></i>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="row m-0 p-0">
                            <div className="session-details-share--container--item favorite col-auto pl-0 mt-2">
                                <button>
                                    <i className="fak fa-sponsors-white"></i>
                                    Add to Favorites
                                </button>
                            </div>
                            <div className="session-details-share--container--item calendar col-auto pl-0 mt-2">
                                <button>
                                    <i className="fak fa-calendar-plus"></i>
                                    Add to Calendar
                                </button>
                            </div>
                        </div>
                    </div>
                </Col>
                <AppSessionTags session={session} />
            </Row>
        </AppCard>
    );
};
