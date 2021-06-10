import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
// import { Link } from "@reach/router";
import { AppButton } from "../AppButton";
import "./assets/scss/style.scss";
import { AppStreamManager } from "../AppStreamManager";
import { Session } from "../../../AdminModule/models";
import { getTime, getDateFormat } from "../../utils";

export interface AppSessionHeaderProps {
    session: Session;
}

export const AppSessionHeader: FC<AppSessionHeaderProps> = ({
    session,
}): JSX.Element => {
    return (
        <Col sm={12} className="session-details-header p-0">
            <Row className="session-details-header--detail mb-3 px-4 pt-4">
                <Col
                    md={6}
                    className="session-details-header--detail--buttons d-flex"
                >
                    <a href="#" className="live-now-btn mr-3">
                        <i className="fak fa-live"></i>
                        Live Now
                    </a>
                    {/* <a href="#" className="watching-btn">
                        <i className="fak fa-users-tg"></i>
                        <span className="pr-1">1521</span>Watching
                    </a> */}
                </Col>
                <Col
                    md={6}
                    className="text-right session-details-header--detail--action mt-2 mt-lg-0"
                >
                    <Col sm={"auto"} className="button-action-session pr-0">
                        <AppButton
                            variant="secondary"
                            className="button-action-session--left"
                        >
                            <i className="fak fa-chevron-left"></i>
                            {/* <div className="button-action-session--left--popup">
                                <div className="row m-0 p-0">
                                    <div className="button-action-session--left--popup--pic col-4 p-0 pl-2">
                                        <a href="#">
                                            <div className="button-action-session--left--popup--pic--container"></div>
                                        </a>
                                    </div>
                                    <div className="button-action-session--left--popup--detail col-8 pl-3 py-0">
                                        <div className="row m-0 p-0">
                                            <label className="button-action-session--left--popup--detail--top-title col-12 p-0">
                                                Previous Session
                                            </label>
                                            <a
                                                className="button-action-session--left--popup--detail--title col-12 p-0"
                                                href="#"
                                            >
                                                A wide choice of ways fast and
                                                secure{" "}
                                            </a>
                                            <label className="button-action-session--left--popup--detail--hosted-by col-12 p-0 pt-2">
                                                Hosted By
                                            </label>
                                            <div className="button-action-session--left--popup--detail--hosted-by-user col-12 p-0">
                                                <div className="row m-0 p-0">
                                                    <div className="button-action-session--left--popup--detail--hosted-by-user--avatar col-md-auto p-0">
                                                        <span></span>
                                                    </div>
                                                    <div className="button-action-session--left--popup--detail--hosted-by-user--name col-md-auto px-1">
                                                        <span>
                                                            Eleanor Pena
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        */}
                        </AppButton>
                        <AppButton
                            variant="secondary"
                            className="button-action-session--right ml-2"
                        >
                            <i className="fak fa-chevron-right"></i>
                            {/* <div className="button-action-session--right--popup">
                                <div className="row m-0 p-0">
                                    <div className="button-action-session--right--popup--pic col-4 p-0 pl-2">
                                        <a href="#">
                                            <div className="button-action-session--right--popup--pic--container"></div>
                                        </a>
                                    </div>
                                    <div className="button-action-session--right--popup--detail col-8 pl-3 py-0">
                                        <div className="row m-0 p-0">
                                            <label className="button-action-session--right--popup--detail--top-title col-12 p-0">
                                                Next Session
                                            </label>
                                            <a
                                                className="button-action-session--right--popup--detail--title col-12 p-0"
                                                href="#"
                                            >
                                                A wide choice of ways fast and
                                                secure{" "}
                                            </a>
                                            <label className="button-action-session--right--popup--detail--hosted-by col-12 p-0 pt-2">
                                                Hosted By
                                            </label>
                                            <div className="button-action-session--right--popup--detail--hosted-by-user col-12 p-0">
                                                <div className="row m-0 p-0">
                                                    <div className="button-action-session--right--popup--detail--hosted-by-user--avatar col-md-auto p-0">
                                                        <span></span>
                                                    </div>
                                                    <div className="button-action-session--right--popup--detail--hosted-by-user--name col-md-auto px-1">
                                                        <span>Alex Senim</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                       */}
                        </AppButton>
                    </Col>
                </Col>
                <Col
                    md={12}
                    className="session-details-header--detail--title mt-4"
                >
                    <Row>
                        <Col
                            lg={8}
                            className="session-details-header--detail--title--text "
                        >
                            <h1>{session.title}</h1>
                        </Col>
                        <Col
                            lg={"auto"}
                            className="session-details-header--detail--title--time text-lg-right text-left mr-0 ml-auto mt-2 mt-lg-0"
                        >
                            <span className="date mb-1">
                                {getDateFormat(session.start)}
                            </span>
                            <span className="period">
                                {getTime(session.start)}- {getTime(session.end)}
                            </span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="session-details-header--banner m-0 p-0">
                <Col sm={12} className="p-0">
                    <AppStreamManager session={session} />
                </Col>
            </Row>
        </Col>
    );
};
