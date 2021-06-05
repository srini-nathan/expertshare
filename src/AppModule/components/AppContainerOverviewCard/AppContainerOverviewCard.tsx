import React, { FC } from "react";
import { PContainer } from "../../../AdminModule/models";
import "./assets/scss/overview.scss";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_CONTAINER_POSTER },
} = UPLOAD;
const { path } = FILETYPEINFO_CONTAINER_POSTER;

export interface AppContainerOverviewCardProps {
    container: PContainer;
    onClick: () => void;
}

export const AppContainerOverviewCard: FC<AppContainerOverviewCardProps> = ({
    container,
    onClick,
}): JSX.Element => {
    const { name, description, imageName = null } = container;
    const imagePath = useBuildAssetPath(path, imageName);
    const style = imageName ? { backgroundImage: `url(${imagePath})` } : {};

    return (
        <div className="container-overview--container--item">
            <div className="inner-container white-box" onClick={onClick}>
                <div className="inner-container--banner" style={style}>
                    <div className="inner-container--banner--icons">
                        {/* <a href="#" className="add-favorite"> */}
                        {/* @TODO: Ask Daniel, to replace this with AppIcon  */}
                        {/*    <i */}
                        {/*        className="fak fa-star-light" */}
                        {/*        aria-hidden="true" */}
                        {/*    ></i> */}
                        {/* </a> */}
                    </div>
                </div>
                <div className="inner-container--det p-3 mx-2">
                    <div className="inner-container--det--title">
                        <a href="#">
                            <h2>{name}</h2>
                        </a>
                    </div>
                    <div className="inner-container--det--desc">
                        <p className="mb-0">{description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
