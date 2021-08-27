import React, { FC, useEffect, useState } from "react";
import { Link, RouteComponentProps, useParams } from "@reach/router";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { AppLoader, AppCard } from "../../../AppModule/components";
import { errorToast, getBGStyle, resolveImage } from "../../../AppModule/utils";
import { ExhibitorApi } from "../../apis";
import { Exhibitor, User } from "../../models";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
} from "../../../config";
import placeholder from "../../../AppModule/assets/images/imgthumb.svg";
import { useBuildAssetPath } from "../../../AppModule/hooks";
import { ExhibitorDetailPageMembers } from "./ExhibitorDetailPageMembers";
import { ExhibitorDetailPageContact } from "./ExhibitorDetailPageContact";
import { ExhibitorDetailPageVideo } from "./ExhibitorDetailPageVideo";
import "./assets/scss/detail.scss";

export const ExhibitorDetailPage: FC<RouteComponentProps> = (): JSX.Element => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [loading, isLoading] = useState<boolean>(true);
    const [data, setData] = useState<Exhibitor>();
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
        <>
            <div className="row m-0 exhibitor-detail">
                <div className="col-md-12 col-sm-12 col-xl-8 p-3 p-lg-4">
                    <div className="row m-0 card mb-3 mb-lg-4">
                        <div className="exhibitors-header col-12">
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
                                        <i style={style}></i>
                                    </div>
                                    <img src={poster} />
                                </div>
                            </div>
                        </div>
                    </div>
                    {data?.members && data?.members.length > 0 ? (
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
                    ) : null}
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
                </div>
            </div>
        </>
    );
};
