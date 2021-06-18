import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
    return (
        <AppCard>
            <Row className="m-0 mb-3 mb-lg-4">
                <Col md={6} className="session-details-info my-4 px-4">
                    <h2>
                        <i className="fak fa-session-details"></i>
                        {t("sessionDetails:section.sessionDetails")}
                    </h2>
                    <div className="session-details-info--container mt-4">
                        <Row className="m-0 p-0">
                            <Col
                                sm={6}
                                className="session-details-info--container--item px-0 pb-3"
                            >
                                <span>
                                    <i className="fak fa-seat"></i>
                                    56/120 {t("sessionDetails:label.seats")}
                                </span>
                            </Col>
                            {session.isJoinRequired && (
                                <Col
                                    sm={6}
                                    className="session-details-info--container--item px-0 pb-3"
                                >
                                    <span>
                                        <i className="fak fa-icn-user-check"></i>
                                        {t("sessionDetails:label.mandatory")}
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

                    {session.isExternalLinkEnable && (
                        <a target="_blank" href={session.externalLinkUrl}>
                            <h2>
                                <i className="far fa-link"></i>
                                {session.externalLinkLabel}
                            </h2>
                        </a>
                    )}
                </Col>
                <Col
                    md={6}
                    className="session-details-share my-0 my-md-4 pl-4 pl-md-5 pr-4"
                >
                    <h2>
                        <i className="fak fa-like-share"></i>
                        {t("sessionDetails:label.likeAndShare")}
                    </h2>
                    <div className="session-details-share--container mt-1">
                        <div className="row m-0 p-0">
                            <div className="session-details-share--container--item like col-auto pl-0 mt-2">
                                <button>
                                    <i className="fak fa-hearts"></i>
                                    <span>1293</span>
                                    {t("sessionDetails:label.likes")}
                                </button>
                            </div>
                            <div className="session-details-share--container--item share col-auto pl-0 mt-2">
                                <button>
                                    <i className="fak fa-share-alt"></i>
                                    {t("sessionDetails:label.share")}
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
                                    {t("sessionDetails:button.addToFavorite")}
                                </button>
                            </div>
                            <div className="session-details-share--container--item calendar col-auto pl-0 mt-2">
                                <button>
                                    <i className="fak fa-calendar-plus"></i>
                                    {t("sessionDetails:button.addToCalendar")}
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
