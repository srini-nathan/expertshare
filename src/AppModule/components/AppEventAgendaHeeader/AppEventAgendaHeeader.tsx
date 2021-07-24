import React, { FC } from "react";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
import { Conference } from "../../../AdminModule/models";
import "./assets/scss/style.scss";
import placeholder from "../../assets/images/imgthumb.svg";
import { useBuildAssetPath } from "../../hooks";
import { CONSTANTS } from "../../../config";
import { AppButton } from "../AppButton";
import { FileTypeInfo } from "../../models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_CONFERENCE_POSTER },
} = UPLOAD;
export interface AppEventAgendaHeeaderProps {
    conference: Conference;
    handleClone: () => void;
    handleDelete: () => void;
    isGrantedControl: boolean;
}

export const AppEventAgendaHeeader: FC<AppEventAgendaHeeaderProps> = ({
    conference,
    handleClone,
    handleDelete,
    isGrantedControl,
}): JSX.Element => {
    const conferencePosterPath = useBuildAssetPath(
        FILETYPEINFO_CONFERENCE_POSTER as FileTypeInfo,
        conference?.imageName
    );
    const { t } = useTranslation();
    const styles = conference?.imageName
        ? {
              backgroundImage: `url(${conferencePosterPath})`,
          }
        : {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "inherit",
              backgroundPosition: "center",
          };
    // const [isReadMore, setIsReadMore] = useState(true);
    // const showMore = () => {
    //     if (conference?.description.length < 800) return "";
    //     if (isReadMore) return `+${t("common:showMore")}`;
    //     return `-${t("common:showLess")}`;
    // };
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
                        <Link to="#">
                            <h1 className="mb-0">{conference?.title}</h1>
                        </Link>
                    </Col>
                    <Col
                        sm="auto"
                        className="inner-container--action mr-0 ml-auto px-0 mt-2 mt-lg-0"
                    >
                        {isGrantedControl && (
                            <>
                                <div className="inner-container--action--base m-auto row">
                                    <Link
                                        to="/admin/session-categories"
                                        className="manage-cat btn btn-secondary mt-2 mt-sm-0"
                                    >
                                        {t(
                                            "event.agenda:button.manageCategory"
                                        )}
                                    </Link>
                                    <Link
                                        to={`/event/${conference.id}/session/create`}
                                        className="manage-cat ml-2 btn btn-secondary mt-2 mt-sm-0"
                                    >
                                        {t("event.agenda:button.createSession")}
                                    </Link>

                                    <Link
                                        to={`/event/create`}
                                        className="manage-cat ml-2 btn btn-secondary mt-2 mt-sm-0"
                                    >
                                        {t("event.agenda:button.createEvent")}
                                    </Link>
                                </div>
                                <div className="inner-container--action--exclusive p-0 mt-2 mt-sm-3">
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
                                        className="mx-2"
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
                                        className="  ml-2"
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
                    </Col>
                </Row>
            </Col>
            <Col className="inner-container bottom px-4 pt-0 pb-4">
                <Row className="m-0 p-0">
                    <Col className="col-offset-4"></Col>
                    <Col
                        lg={7}
                        xl={9}
                        className="inner-container--det px-0 pl-lg-4 pr-lg-0 mr-0 ml-auto"
                    >
                        <Col className="inner-container--det--sponsors p-0 mt-4">
                            <Col className="inner-container--det--sponsors--title p-0 mb-3">
                                <h2 className="mb-0">
                                    <i className="fak fa -handshake-alt-light"></i>
                                    {/* Sponsors */}
                                </h2>
                            </Col>
                            <Col className="inner-container--det--sponsors--content carousel p-0">
                                <Col className="p-0 inner-container--det--sponsors--content--item sponsor-1">
                                    <a href="#">
                                        <i></i>
                                    </a>
                                </Col>
                            </Col>
                        </Col>
                    </Col>
                </Row>
            </Col>
        </Col>
    );
};
