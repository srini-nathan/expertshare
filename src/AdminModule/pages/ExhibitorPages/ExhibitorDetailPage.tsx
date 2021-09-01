import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps, useParams, useMatch } from "@reach/router";
import { useTranslation } from "react-i18next";
import "./assets/scss/detail.scss";
import { Col, Row } from "react-bootstrap";
import {
    AppLoader,
    AppCard,
    AppSessionUsers,
    AppButton,
} from "../../../AppModule/components";
import { errorToast } from "../../../AppModule/utils";
import { ExhibitorApi } from "../../apis";
import { Exhibitor, User } from "../../models";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
} from "../../../config";
import placeholder from "../../../AppModule/assets/images/imgthumb.svg";
import { useBuildAssetPath } from "../../../AppModule/hooks";

export const ExhibitorDetailPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const adminPage = useMatch("/admin/exhibitors/:id/detail");
    const isFrontPage = adminPage === null;
    const { id } = useParams();
    const [loading, isLoading] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor>();
    const imagePath = useBuildAssetPath(ExhibitorPosterFileInfo);
    const logoPath = useBuildAssetPath(ExhibitorLogoPosterFileInfo);

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

    const style = data?.logoImageName
        ? {
              backgroundImage: `url(${logoPath}/${data?.logoImageName})`,
          }
        : {
              backgroundImage: `url(${placeholder})`,
          };

    return (
        <>
            <div className="row m-0">
                <div className="col-md-12 col-sm-12 col-xl-8 p-3 p-lg-4">
                    <div className="row m-0 card mb-3 mb-lg-4">
                        <div className="exhibitors-header col-12">
                            <div className="row exhibitors-header--detail mb-3 px-2 pt-4">
                                <div className="col-12 exhibitors-header--detail--buttons d-flex">
                                    <Link
                                        to={
                                            isFrontPage
                                                ? "/exhibitors"
                                                : "/admin/exhibitors"
                                        }
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
                                        <i style={style}></i>
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
                        </div>
                    </div>
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
                </div>
            </div>
        </>
    );
};
