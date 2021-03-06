import React, { FC } from "react";
import { PContainer } from "../../../AdminModule/models";
import "./assets/scss/overview.scss";
import { CONSTANTS } from "../../../config";
import { useBuildAssetPath } from "../../hooks";
import placeholder from "./assets/images/imgthumb.svg";
import { FileTypeInfo } from "../../models";

const { Upload: UPLOAD } = CONSTANTS;
const {
    FILETYPEINFO: { FILETYPEINFO_CONTAINER_POSTER },
} = UPLOAD;

export interface AppContainerOverviewCardProps {
    container: PContainer;
    onClick: () => void;
}

export const AppContainerOverviewCard: FC<AppContainerOverviewCardProps> = ({
    container,
    onClick,
}): JSX.Element => {
    const { name, description, imageName = null } = container;
    const imagePath = useBuildAssetPath(
        FILETYPEINFO_CONTAINER_POSTER as FileTypeInfo,
        imageName
    );
    const style = imageName
        ? {
              backgroundImage: `url(${imagePath})`,
          }
        : {
              backgroundImage: `url(${placeholder})`,
              backgroundSize: "inherit",
              backgroundPosition: "center",
          };

    return (
        <div className="container-overview--container--item card">
            <div className="inner-container" onClick={onClick}>
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
