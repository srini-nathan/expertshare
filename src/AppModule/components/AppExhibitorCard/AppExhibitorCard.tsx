import React, { FC } from "react";
import { Link } from "@reach/router";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { PExhibitor, User } from "../../../AdminModule/models";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
} from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import { AppSessionUsers } from "../AppSessionUsers";
import "./assets/scss/style.scss";
import placeholder from "../../assets/images/imgthumb.svg";

export interface AppExhibitorCardProps {
    data: PExhibitor;
    isGrantedControl?: boolean;
    handleDelete: (id: number) => void;
    handleClone: (id: number) => void;
}

export const AppExhibitorCard: FC<AppExhibitorCardProps> = ({
    data,
    handleDelete,
    isGrantedControl,
}): JSX.Element => {
    const { t } = useTranslation();
    const { id, name, coverImageName, isVisible, logoImageName } = data;

    const imagePath = useBuildAssetPath(
        ExhibitorPosterFileInfo,
        coverImageName
    );

    const logoPath = useBuildAssetPath(
        ExhibitorLogoPosterFileInfo,
        logoImageName
    );

    const style = coverImageName
        ? {
              backgroundImage: `url(${imagePath})`,
          }
        : {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "inherit",
              backgroundPosition: "center",
          };

    return (
        <Col md={12} lg={4} xl={3} className="exhibitor-grid--container--item">
            <Col className="inner-container p-0 card">
                <Link to={`/admin/exhibitors/${id}/detail`}>
                    <div className="inner-container--banner" style={style}>
                        {logoImageName ? <img src={logoPath} /> : null}
                        <div className="inner-container--banner--button">
                            {!isVisible ? (
                                <span className="live-now-btn mr-3">
                                    {t("exhibitor.list:badge.inActive")}
                                </span>
                            ) : (
                                <span className="archived-btn mr-3">
                                    {t("exhibitor.list:badge.active")}
                                </span>
                            )}
                        </div>

                        <div className="inner-container--banner--icons ">
                            {isGrantedControl && (
                                <>
                                    <Link to={`/admin/exhibitors/${id}`}>
                                        <i className="fak fa-pen-regular mb-1"></i>
                                    </Link>
                                    <Link
                                        to={"#"}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleDelete(id as number);
                                        }}
                                    >
                                        <i className="fak fa-trash-light"></i>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </Link>
                <div className="inner-container--det p-3 mx-2">
                    <Col className="inner-container--det--title p-0">
                        <Link to={`/admin/exhibitors/${id}/details`}>
                            <h2>{name}</h2>
                        </Link>
                    </Col>
                    <AppSessionUsers
                        xl={12}
                        lg={12}
                        md={12}
                        sm={12}
                        selectedUsers={data.members as User[]}
                        title={t("exhibitor.list:label.members")}
                        icon="speakers"
                    />
                </div>
            </Col>
        </Col>
    );
};
