import React, { FC } from "react";
import { Col } from "react-bootstrap";
import { Link } from "@reach/router";
import { ExhibitorProduct } from "../../../AdminModule/models";
import { ExhibitorProductPosterFileInfo } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import { getBGStyle } from "../../utils";
import "./assets/scss/style.scss";

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
    const { id, name, imageName, price, isCta, ctaUrl, ctaLabel } = data;

    const basePath = useBuildAssetPath(ExhibitorProductPosterFileInfo);

    const style = getBGStyle(basePath, imageName);

    return (
        <Col
            className="exhibitors-products--content--item product mb-4"
            xs={12}
            sm={6}
            md={6}
            lg={4}
        >
            <div className="inner-content card p-3">
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
                    <a href="#">
                        <i className={"poster"} style={style}></i>
                    </a>
                </div>
                <div className="inner-content--title mb-2">
                    <a href="#">
                        <h2 className="mb-0">{name}</h2>
                    </a>
                </div>
                <div className="inner-content--desc mb-2">
                    <p className="mb-0">
                        Your Platform for Virtual Events Expertshare is a
                        web-based conference and collaboration platform for
                        virtual events. It combines solutions for e-learning,
                        online conferences, virtual events with livestream and
                    </p>
                </div>
                {/* <div className="inner-content--category mb-3">
                    <a href="#">
                        <h3 className="mb-0">Category</h3>
                    </a>
                </div> */}
                <div className="inner-content--price">
                    <span> {price} </span>
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
                    <a className="btn btn-secondary">Document</a>
                </div>
            </div>
        </Col>
    );
};
