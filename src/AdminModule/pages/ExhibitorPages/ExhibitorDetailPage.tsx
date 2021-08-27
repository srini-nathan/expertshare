import React, { FC, useEffect, useState, Fragment } from "react";
import { Link, RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import {
    AppQuestionsAndAnswers,
    AppLoader,
    AppCard,
} from "../../../AppModule/components";
import { errorToast, getBGStyle, resolveImage } from "../../../AppModule/utils";
import { ExhibitorApi } from "../../apis";
import { Exhibitor, User } from "../../models";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
} from "../../../config";
import placeholder from "../../../AppModule/assets/images/imgthumb.svg";

import { useAuthState, useBuildAssetPath } from "../../../AppModule/hooks";
import { ExhibitorCommentsAPI } from "../../../AppModule/apis";

import { ExhibitorDetailPageMembers } from "./ExhibitorDetailPageMembers";
import { ExhibitorDetailPageContact } from "./ExhibitorDetailPageContact";
import { ExhibitorDetailPageVideo } from "./ExhibitorDetailPageVideo";
import "./assets/scss/detail.scss";

export const ExhibitorDetailPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [loading, isLoading] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor>();
    const { containerId } = useAuthState();
    const imagePath = useBuildAssetPath(ExhibitorPosterFileInfo);
    const logoPath = useBuildAssetPath(ExhibitorLogoPosterFileInfo);
    const [members, setMembers] = useState<User[]>([]);
    const [haveMembers, setHaveMembers] = useState<boolean>(members.length > 0);

    useEffect(() => {
        isLoading(true);
        ExhibitorApi.findById<Exhibitor>(id).then(
            ({ response, isNotFound }) => {
                if (isNotFound) {
                    errorToast(t("exhibitor.detail:error.message.notExist"));
                } else if (response !== null) {
                    setData(response);
                    const users = response?.members ?? [];
                    setMembers(users as User[]);
                    setHaveMembers(users.length > 0);
                }
                isLoading(false);
            }
        );
    }, [id]);

    if (loading) {
        return <AppLoader />;
    }

    const style = getBGStyle(logoPath, data?.logoImageName, placeholder);
    const poster = resolveImage(imagePath, data?.coverImageName, placeholder);
    return (
        <Fragment>
            <Row className="m-0">
                <Col
                    className={
                        data?.isCommentEnable
                            ? "pl-0 pr-0 pr-lg-3 comment-enable"
                            : "px-0"
                    }
                    md={12}
                    sm={12}
                    lg={data?.isCommentEnable ? 8 : 12}
                >
                    <Row className="m-0 card mb-3 mb-lg-4">
                        <Col className="exhibitors-header" xs={12}>
                            <div className="row exhibitors-header--detail mb-3 px-2 pt-4">
                                <div className="col-12 exhibitors-header--detail--buttons d-flex">
                                    <Link
                                        to={"/admin/exhibitors"}
                                        className="back-btn btn btn-secondary mr-3"
                                    >
                                        <i className="fak fa-chevron-left mr-3"></i>
                                        {t("Back")}
                                    </Link>
                                </div>
                                <div className="col-12 exhibitors-header--detail--title mt-4">
                                    <h1>{data?.name}</h1>
                                </div>
                            </div>
                            <div className="row exhibitors-header--banner">
                                <div className="col-12 p-0">
                                    <div className="sponsor">
                                        {data?.logoImageName ? (
                                            <i style={style}></i>
                                        ) : null}
                                    </div>
                                    <img src={poster} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <AppCard>
                        <Row className="m-0 mb-3 mb-lg-4">
                            {haveMembers ? (
                                <Col
                                    lg={7}
                                    xl={7}
                                    md={12}
                                    className={`create-session--speakers divider-right`}
                                >
                                    <ExhibitorDetailPageMembers
                                        members={members}
                                    />
                                </Col>
                            ) : (
                                <></>
                            )}
                            <Col
                                lg={haveMembers ? 5 : 12}
                                xl={haveMembers ? 5 : 12}
                            >
                                <ExhibitorDetailPageContact data={data} />
                            </Col>
                        </Row>
                    </AppCard>
                    <ExhibitorDetailPageVideo
                        type={data?.streamType}
                        url={data?.streamUrl}
                    />
                    {data?.description && data?.description !== "" ? (
                        <AppCard>
                            <Row className={"mb-3"}>
                                <Col>
                                    <h4>
                                        <i className="fak fa-description mr-2"></i>
                                        {t(
                                            "exhibitor.detail:section.description"
                                        )}
                                    </h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col className="session-details-desc">
                                    <p
                                        dangerouslySetInnerHTML={{
                                            __html: data.description,
                                        }}
                                    ></p>
                                </Col>
                            </Row>
                        </AppCard>
                    ) : null}
                </Col>
                {data?.isCommentEnable && (
                    <Col md={12} sm={12} lg={4} className="pr-0 pl-0 pl-lg-3">
                        <AppQuestionsAndAnswers
                            name={t(
                                "exhibitor.detail:section.questionAndAnswers"
                            )}
                            parentId={id}
                            socketParentId={`exhibitor_${id}`}
                            container={containerId}
                            commentsAPI={ExhibitorCommentsAPI}
                            parentElement="/api/exhibitor_comments"
                            mainElement="api/exhibitors"
                        />
                    </Col>
                )}
            </Row>
        </Fragment>
    );
};
