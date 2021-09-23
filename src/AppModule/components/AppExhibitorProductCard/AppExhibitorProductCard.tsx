import React, { FC, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "@reach/router";
import { useTranslation } from "react-i18next";
import { ExhibitorProduct } from "../../../AdminModule/models";
import { ExhibitorProductPosterFileInfo } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import { getBGStyle } from "../../utils";
import "./assets/scss/style.scss";
import { AppDocDownload } from "../AppDocDownload";

export interface AppExhibitorProductCardProps {
    data: ExhibitorProduct;
    isGrantedControl?: boolean;
    handleDelete: (id: number) => void;
    handleClone: (id: number) => void;
    parentId: number;
}

export const AppExhibitorProductCard: FC<AppExhibitorProductCardProps> = ({
    data,
    isGrantedControl,
    handleDelete,
    parentId,
}): JSX.Element => {
    const {
        id,
        name,
        imageName,
        price,
        isCta,
        ctaUrl,
        ctaLabel,
        description,
        exhibitorProductTags,
        exhibitorProductDocs,
    } = data;
    const [showMore, isShowMore] = useState<boolean>(false);
    const basePath = useBuildAssetPath(ExhibitorProductPosterFileInfo);

    const style = getBGStyle(basePath, imageName);
    const { t } = useTranslation();

    const renderTags = () => {
        if (exhibitorProductTags.length === 0) {
            return <></>;
        }
        return (
            <div>
                <div className="conference-tags-container--title ">
                    <h3 className="mb-0">
                        <i className="fak fa-tags"></i>
                        {t("admin.exhibitorProduct:label.tags")}
                    </h3>
                </div>
                <Row className={"m-0 mt-2 p-0 conference-tags-container--tags"}>
                    {exhibitorProductTags.map((e) => {
                        return (
                            <div className={"conference-tags"} key={e.id}>
                                {e.name}
                            </div>
                        );
                    })}
                </Row>
            </div>
        );
    };

    return (
        <Col
            className="exhibitors-products--content--item product mb-4"
            xs={12}
            sm={6}
            md={6}
            lg={6}
            xl={4}
        >
            <div className="inner-content card p-3">
                <AppDocDownload
                    show={showMore}
                    handleClose={isShowMore}
                    docs={exhibitorProductDocs}
                />
                <div className="inner-content--icons ">
                    {isGrantedControl && (
                        <>
                            <Link
                                to={`/admin/exhibitors/${parentId}/products/${id}`}
                            >
                                <i className="fak fa-pen-regular mb-1"></i>
                            </Link>
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(id as number);
                                }}
                            >
                                <i className="fak fa-trash-light"></i>
                            </a>
                        </>
                    )}
                </div>
                <div className="inner-content--pic mb-2">
                    <a>
                        <i className={"poster"} style={style}></i>
                    </a>
                </div>
                <div className="inner-content--title mb-2">
                    <a>
                        <h2 className="mb-0">{name}</h2>
                    </a>
                </div>
                <div className="inner-content--desc mb-2">
                    <p className="mb-0">{description}</p>
                </div>
                <div className="inner-content--category mb-2">
                    {renderTags()}
                </div>
                <div className="inner-content--price">
                    {parseInt(price, 10) > 0 ? <span> {price} </span> : null}
                </div>
                <div className="inner-content--buttons">
                    {isCta ? (
                        <a
                            className="btn btn-secondary mb-2"
                            href={ctaUrl}
                            target="_blank"
                        >
                            {ctaLabel}
                        </a>
                    ) : null}
                    {exhibitorProductDocs?.length > 0 ? (
                        <a
                            className="btn btn-secondary document-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                isShowMore(true);
                            }}
                        >
                            {t("admin.exhibitorProduct:button.showDocuments")}
                        </a>
                    ) : null}
                </div>
            </div>
        </Col>
    );
};
