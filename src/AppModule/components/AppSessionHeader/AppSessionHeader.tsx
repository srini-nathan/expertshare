import React, { FC, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { Link, navigate, useLocation } from "@reach/router";
import "./assets/scss/style.scss";
import { AppStreamManager } from "../AppStreamManager";
import { Session } from "../../../AdminModule/models";
import { useGlobalData } from "../../contexts";
import { getDateTimeWithoutTimezone } from "../../utils";
import { useLanguages, useUserLocale } from "../../hooks";

export interface AppSessionHeaderProps {
    session: Session;
    next: number | null;
    prev: number | null;
    conferenceId: number;
    sessionList: any[];
}

export const AppSessionHeader: FC<AppSessionHeaderProps> = ({
    session,
    next,
    prev,
    conferenceId,
    sessionList,
}): JSX.Element => {
    const { container } = useGlobalData();
    const { t } = useTranslation();
    const { locale, setLocale } = useUserLocale();
    const [live, isLive] = useState<boolean>(false);
    const { Languages } = useLanguages();
    const location = useLocation();

    return (
        <Col sm={12} className="session-details-header mb-4 p-0">
            <Row className="session-details-header--detail mb-3 px-4 pt-4">
                <Col
                    md={6}
                    className="session-details-header--detail--buttons d-flex"
                >
                    <Link
                        to={`/event/${conferenceId}/agenda`}
                        state={{ sessionList }}
                        className="btn btn-secondary back-btn  mr-3"
                    >
                        <i className="fak fa-chevron-left"></i>
                        {t("sessionDetails:lable.back")}
                    </Link>
                    {live && (
                        <a href="#" className="live-now-btn mr-3">
                            <i className="fak fa-live"></i>
                            {t("sessionDetails:lable.liveNow")}
                        </a>
                    )}

                    {/* <a href="#" className="watching-btn">
                        <i className="fak fa-users-tg"></i>
                        <span className="pr-1">1521</span>Watching
                    </a> */}
                </Col>
                <Col
                    md={6}
                    className="text-right session-details-header--detail--action mt-2 mt-lg-0"
                >
                    <div className="col-auto language-dropdown pr-0 pl-0 pl-lg-2">
                        <div className="dropdown">
                            <button
                                className="dropdown-toggle px-3"
                                type="button"
                                id="dropdownMenuButton"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <i className={`languages ${locale}`}></i>
                            </button>
                            <div
                                className="dropdown-menu"
                                aria-labelledby="dropdownMenuButton"
                            >
                                {Languages().map((e) => {
                                    return (
                                        <span
                                            onClick={() => {
                                                setLocale(e.locale);
                                                navigate("/reloading", {
                                                    state: {
                                                        url: location.pathname,
                                                    },
                                                });
                                            }}
                                            className="dropdown-item"
                                        >
                                            <i
                                                className={`languages ${e.locale}`}
                                            ></i>
                                            {e.name}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <Col sm={"auto"} className="button-action-session pr-0">
                        {prev && (
                            <Link
                                to={`/event/${conferenceId}/session/${prev}`}
                                state={{ sessionList }}
                                className="btn btn-secondary button-action-session--left  ml-2"
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
                            </Link>
                        )}
                        {next && (
                            <Link
                                to={`/event/${conferenceId}/session/${next}`}
                                state={{ sessionList }}
                                className="btn btn-secondary button-action-session--right ml-2"
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
                            </Link>
                        )}
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
                                {session.start &&
                                    format(
                                        getDateTimeWithoutTimezone(
                                            session.start
                                        ),
                                        container &&
                                            container.configuration &&
                                            (container.configuration as any)
                                                .shortDate
                                            ? (container.configuration as any)
                                                  .shortDate
                                            : "EEEE MMMM, dd"
                                    )}
                            </span>
                            <span className="period">
                                {session.start &&
                                    format(
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
                                    )}{" "}
                                -{" "}
                                {session.end &&
                                    format(
                                        getDateTimeWithoutTimezone(session.end),
                                        container &&
                                            container.configuration &&
                                            (container.configuration as any)
                                                .shortTime
                                            ? (container.configuration as any)
                                                  .shortTime
                                            : "hh:mm a"
                                    )}
                            </span>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="session-details-header--banner m-0 p-0">
                <Col sm={12} className="p-0">
                    {session.start && (
                        <AppStreamManager isLive={isLive} session={session} />
                    )}
                </Col>
            </Row>
        </Col>
    );
};
