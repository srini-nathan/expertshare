import React, { FC } from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Conference } from "../../../AdminModule/models";
import placeholder from "../../assets/images/imgthumb.svg";
import { useAuthState, useBuildAssetPath } from "../../hooks";
import {
    ExhibitorLogoPosterFileInfo,
    ConferencePosterFileInfo,
} from "../../../config";
import { AppButton } from "../AppButton";
import { AppSponsors } from "../AppSponsors";
import "./assets/scss/style.scss";
import { resolveImageWithStyle } from "../../utils";

export interface AppEventAgendaHeeaderProps {
    conference: Conference;
    handleClone: () => void;
    handleDelete: () => void;
    isGrantedControl: boolean;
}

const sponsorImages = {
    desktop: {
        breakpoint: {
            max: 3000,
            min: 1024,
        },
        items: 12,
        partialVisibilityGutter: 40,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 6,
        partialVisibilityGutter: 30,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 3,
        partialVisibilityGutter: 30,
    },
};

const sponsorImagesInLine = {
    desktop: {
        breakpoint: {
            max: 3000,
            min: 1024,
        },
        items: 8,
        partialVisibilityGutter: 40,
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 6,
        partialVisibilityGutter: 30,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 3,
        partialVisibilityGutter: 30,
    },
};

export const AppEventAgendaHeeader: FC<AppEventAgendaHeeaderProps> = ({
    conference,
    handleClone,
    handleDelete,
    isGrantedControl,
}): JSX.Element => {
    const { containerId } = useAuthState();
    const conferencePosterPath = useBuildAssetPath(ConferencePosterFileInfo);
    const exhibitorLogoBasePath = useBuildAssetPath(
        ExhibitorLogoPosterFileInfo
    );
    const { t } = useTranslation();
    const styles = resolveImageWithStyle(
        conferencePosterPath,
        conference?.imageName,
        placeholder
    );

    return (
        <Col className="event-detail-admin--det--container card col-12 mb-3 px-0">
            <Col className="inner-container top px-4 pt-4 pb-3">
                <Row className="m-0 p-0">
                    <Col
                        md={12}
                        lg={7}
                        xl={7}
                        className="inner-container--title px-0 pl-sm-0"
                    >
                        <Link
                            to={"/event"}
                            className="back-btn btn btn-secondary back-btn mr-3 mb-3"
                        >
                            <i className="fak fa-chevron-left"></i>
                            {t("event.agenda:button.back")}
                        </Link>
                        <Link to="#">
                            <h1 className="mb-0">{conference?.title}</h1>
                        </Link>
                    </Col>
                    <Col
                        sm="auto"
                        lg="5"
                        className="inner-container--action mr-0 ml-auto px-0 mt-2 mt-lg-0"
                    >
                        {isGrantedControl && (
                            <>
                                <div className="inner-container--action--base m-auto row">
                                    <Link
                                        to="/admin/session-categories"
                                        className="manage-cat btn btn-secondary mt-2 mt-sm-0 mb-2"
                                    >
                                        {t(
                                            "event.agenda:button.manageCategory"
                                        )}
                                    </Link>
                                    <Link
                                        to={`/event/${conference.id}/session/create`}
                                        className="manage-cat ml-2 btn btn-secondary mt-2 mt-sm-0 mb-2"
                                    >
                                        {t("event.agenda:button.createSession")}
                                    </Link>

                                    <Link
                                        to={`/event/create`}
                                        className="manage-cat ml-2 btn btn-secondary mt-2 mt-sm-0 mb-2"
                                    >
                                        {t("event.agenda:button.createEvent")}
                                    </Link>
                                </div>
                                <div className="inner-container--action--exclusive p-0 mt-2 mt-sm-3 mb-2">
                                    <AppButton
                                        variant="secondary"
                                        onClick={() => {
                                            handleClone();
                                        }}
                                        className="mr-2"
                                    >
                                        <i className="fak fa-clone-light"></i>
                                    </AppButton>
                                    <Link
                                        to={`/event/${conference.id}/update`}
                                        className="mx-2 mb-2"
                                    >
                                        <AppButton variant="secondary">
                                            <i className="fak fa-pen-regular"></i>
                                        </AppButton>
                                    </Link>
                                    <AppButton
                                        variant="secondary"
                                        onClick={() => {
                                            handleDelete();
                                        }}
                                        className="  ml-2 mb-2"
                                    >
                                        <i className="fak fa-trash-light"></i>
                                    </AppButton>
                                </div>
                            </>
                        )}
                    </Col>
                </Row>
                <Row className="m-0 p-0 mt-3">
                    <Col
                        lg={6}
                        xl={4}
                        sm={12}
                        className="inner-container--cover px-0 pr-lg-3"
                    >
                        <i style={styles}></i>
                    </Col>
                    <Col
                        lg={6}
                        xl={8}
                        sm={12}
                        className="inner-container--det mt-3 mt-lg-0 px-0 pl-lg-4 pr-lg-0"
                    >
                        <Col className="inner-container--det--desc p-0">
                            <i className="fak fa-description"></i>
                            <Col className="p-0 inner-container--det--desc--content">
                                <h2 className="">
                                    {t("event.agenda:label.description")}
                                </h2>

                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: conference?.description || "",
                                    }}
                                    className="mb-0"
                                >
                                    {/* {isReadMore
                                        ? conference?.description.slice(0, 500)
                                        : conference?.description} */}
                                    {/* <span
                                        onClick={() => {
                                            setIsReadMore(!isReadMore);
                                        }}
                                        className="read-or-hide mt-2"
                                    >
                                        {showMore()}
                                    </span> */}
                                </p>
                            </Col>
                        </Col>
                        <Col className="inner-container--det--desc p-0 mt-3">
                            {conference?.conferenceTags.length > 0 && (
                                <i className="fak fa-tags"></i>
                            )}
                            <Col className="p-0 inner-container--det--desc--content">
                                <h2 className="">
                                    {conference?.conferenceTags.length > 0 &&
                                        t("event.agenda:label.tags")}
                                </h2>
                                <Row
                                    className={
                                        "m-0 mt-3 p-0 justify-content-left conference-tags-container"
                                    }
                                >
                                    {conference?.conferenceTags.map((e) => {
                                        return (
                                            <span
                                                className={"conference-tags"}
                                                key={e.id}
                                            >
                                                {e.name}
                                            </span>
                                        );
                                    })}
                                </Row>
                            </Col>
                        </Col>
                        {conference?.exhibitors.length > 0 &&
                        conference?.description.length < 200 ? (
                            <Col className="inner-container--det--sponsors p-0 mt-4">
                                <Col className="inner-container--det--sponsors--title p-0 mb-3">
                                    <h2 className="mb-0">
                                        <i className="fak fa-handshake-alt-light"></i>
                                        {t("event.agenda:label.sponsors")}
                                    </h2>
                                </Col>
                                <Col className="inner-container--det--sponsors--content carousel p-0">
                                    <AppSponsors
                                        data={
                                            (conference?.exhibitors as unknown) as string[]
                                        }
                                        basePath={exhibitorLogoBasePath}
                                        containerId={containerId}
                                        customCss={sponsorImagesInLine}
                                    />
                                </Col>
                            </Col>
                        ) : null}
                    </Col>
                </Row>
                {conference?.exhibitors.length > 0 &&
                conference?.description.length > 200 ? (
                    <Col className="inner-container--det--sponsors p-0 mt-4">
                        <Col className="inner-container--det--sponsors--title p-0 mb-3">
                            <h2 className="mb-0">
                                <i className="fak fa-handshake-alt-light"></i>
                                {t("event.agenda:label.sponsors")}
                            </h2>
                        </Col>
                        <Col className="inner-container--det--sponsors--content carousel p-0">
                            <AppSponsors
                                data={
                                    (conference?.exhibitors as unknown) as string[]
                                }
                                basePath={exhibitorLogoBasePath}
                                containerId={containerId}
                                customCss={sponsorImages}
                            />
                        </Col>
                    </Col>
                ) : null}
            </Col>
        </Col>
    );
};
