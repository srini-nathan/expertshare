import React, { FC, useEffect, useState, Fragment } from "react";
import { Link, RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import "./assets/scss/detail.scss";
import { Col, Row } from "react-bootstrap";
import {
    AppLoader,
    AppCard,
    AppSessionUsers,
    AppButton,
    AppQuestionsAndAnswers,
} from "../../../AppModule/components";
import { errorToast, getBGStyle } from "../../../AppModule/utils";
import { ExhibitorApi } from "../../apis";
import { Exhibitor, User } from "../../models";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
    ROLES,
} from "../../../config";
import placeholder from "../../../AppModule/assets/images/imgthumb.svg";
import {
    useAuthState,
    useBuildAssetPath,
    useIsGranted,
} from "../../../AppModule/hooks";
import { ExhibitorCommentsAPI } from "../../../AppModule/apis";

export const ExhibitorDetailPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [loading, isLoading] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor>();
    const { containerId } = useAuthState();
    const imagePath = useBuildAssetPath(ExhibitorPosterFileInfo);
    const logoPath = useBuildAssetPath(ExhibitorLogoPosterFileInfo);
    const isGrantedControl = useIsGranted(ROLES.ROLE_OPERATOR);

    useEffect(() => {
        isLoading(true);
        ExhibitorApi.findById<Exhibitor>(id).then(
            ({ response, isNotFound }) => {
                if (isNotFound) {
                    errorToast(t("exhibitor.detail:error.message.notExist"));
                } else if (response !== null) {
                    setData(response);
                }
                isLoading(false);
            }
        );
    }, [id]);

    if (loading) {
        return <AppLoader />;
    }

    const style = getBGStyle(logoPath, data?.logoImageName ?? "");

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
                                <div className="col-auto exhibitors-header--detail--left-buttons d-flex">
                                    <Link
                                        to={"/admin/exhibitors"}
                                        className="back-btn btn btn-secondary mr-3"
                                    >
                                        <i className="fak fa-chevron-left mr-3"></i>
                                        {t("exhibitor.detail:button.back")}
                                    </Link>
                                </div>
                                {isGrantedControl && (
                                    <div className="col-auto exhibitors-header--detail--right-buttons d-flex mr-0 ml-auto">
                                        <Link
                                            to={`/admin/exhibitors/${id}`}
                                            className="btn btn-secondary edit-btn ml-2"
                                        >
                                            <i className="fak fa-pen-regular mb-1"></i>
                                        </Link>
                                    </div>
                                )}
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
                                    <img
                                        src={
                                            data?.coverImageName
                                                ? `${imagePath}/${data?.coverImageName}`
                                                : placeholder
                                        }
                                    />
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {data?.members && data?.members.length > 0 ? (
                        <AppCard>
                            <Row className="m-0 mb-3 mb-lg-4">
                                <Col
                                    lg={8}
                                    md={12}
                                    className={`create-session--speakers`}
                                >
                                    <AppSessionUsers
                                        xl={6}
                                        lg={6}
                                        md={12}
                                        sm={12}
                                        selectedUsers={data.members as User[]}
                                        title={t(
                                            "exhibitor.detail:label.members"
                                        )}
                                        icon="speakers"
                                    />
                                </Col>
                                <Col lg={4}>
                                    <h2>
                                        <i className="fak fa-speakers"></i>
                                        {t("exhibitor.detail:section.contact")}
                                    </h2>
                                    <div className="d-flex">
                                        <Row>
                                            <Col>
                                                {data.contactUsCaption ? (
                                                    <AppButton
                                                        type="button"
                                                        variant={"secondary"}
                                                    >
                                                        <i className="fa fa-phone-alt mr-1"></i>
                                                        {data.contactUsCaption}
                                                    </AppButton>
                                                ) : null}
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </AppCard>
                    ) : null}
                    {data?.description && data?.description !== "" ? (
                        <AppCard>
                            <Row className="m-0 mb-3 mb-lg-4">
                                <Col
                                    sm={12}
                                    className="session-details-desc my-4 pt-1 px-2"
                                >
                                    <h2>
                                        <i className="fak fa-description"></i>
                                        {t(
                                            "exhibitor.detail:section.description"
                                        )}
                                    </h2>
                                    <div className="session-details-desc--container mt-3">
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: data.description,
                                            }}
                                        ></p>
                                    </div>
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
