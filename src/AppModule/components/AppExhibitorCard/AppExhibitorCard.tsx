import React, { FC, useState } from "react";
import { Link } from "@reach/router";
import { Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { PExhibitor, User } from "../../../AdminModule/models";
import {
    ExhibitorPosterFileInfo,
    ExhibitorLogoPosterFileInfo,
} from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import "./assets/scss/style.scss";
import placeholder from "../../assets/images/imgthumb.svg";
import { AppUserListItem } from "../AppUserListItem";
import { AppShowUserListPopup } from "../AppShowUserListPopup";

export interface AppExhibitorCardProps {
    data: PExhibitor;
    isGrantedControl?: boolean;
    handleDelete: (id: number) => void;
    handleClone: (id: number) => void;
    detailLink: string;
}

export const AppExhibitorCard: FC<AppExhibitorCardProps> = ({
    data,
    handleDelete,
    isGrantedControl,
    detailLink,
}): JSX.Element => {
    const { t } = useTranslation();
    const { id, name, coverImageName, isVisible, logoImageName } = data;
    const [showMore, isShowMore] = useState<boolean>(false);
    const users = data?.members ?? [];
    const limited = users.slice(0, 3);

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
        <Col
            xs={12}
            sm={6}
            lg={4}
            xl={3}
            className="exhibitor-grid--container--item"
        >
            <Col className="inner-container p-0 card">
                <Link to={detailLink}>
                    <div className="inner-container--banner" style={style}>
                        {logoImageName ? <img src={logoPath} /> : null}
                        {isGrantedControl ? (
                            <div className="inner-container--banner--button">
                                {!isVisible ? (
                                    <span className="live-now-btn mr-3">
                                        {t("exhibitor.list:badge.inActive")}
                                    </span>
                                ) : (
                                    <span className="archived-btn mr-3 success-bg">
                                        {t("exhibitor.list:badge.active")}
                                    </span>
                                )}
                            </div>
                        ) : null}

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
                    <AppShowUserListPopup
                        show={showMore}
                        handleClose={isShowMore}
                        users={users as User[]}
                        icon={"atendees-cs"}
                        title={"exhibitor.listCard:section.title.members"}
                    />
                    <Col className="inner-container--det--title p-0">
                        <Link to={detailLink}>
                            <h2>{name}</h2>
                        </Link>
                    </Col>
                    <Col className={"p-0"}>
                        <div className="inner-container--det--content mt-0">
                            {limited?.length > 0 && (
                                <>
                                    <div className="inner-container--det--content--title">
                                        <h3>
                                            <i className="fak fa-atendees-cs mr-2"></i>
                                            {t(
                                                "exhibitor.list:section.title.members"
                                            )}
                                        </h3>
                                    </div>
                                    <div
                                        style={{
                                            overflow: "hidden",
                                        }}
                                        className="inner-container--det--content--speakers mt-2 ml-4"
                                    >
                                        {limited?.map((e: any, i: number) => {
                                            return (
                                                <AppUserListItem
                                                    key={i}
                                                    user={e as User}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="inner-container--det--content--more  ml-4 mt-1">
                                        {users.length > 3 && (
                                            <a
                                                href={"#"}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                    isShowMore(!showMore);
                                                }}
                                            >
                                                {showMore
                                                    ? `- ${t(
                                                          "exhibitor.list:section.showLess"
                                                      )}`
                                                    : `+ ${t(
                                                          "exhibitor.list:section.showMore"
                                                      )}`}
                                            </a>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </Col>
                </div>
            </Col>
        </Col>
    );
};
