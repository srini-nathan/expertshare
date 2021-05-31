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
}

export const AppContainerOverviewCard: FC<AppContainerOverviewCardProps> = ({
    container,
}): JSX.Element => {
    const imagePath = useBuildAssetPath(path, container.imageName || "");

    return (
        <div className="container-overview--container--item">
            <div className="inner-container white-box">
                <div
                    className="inner-container--banner"
                    style={{
                        backgroundImage: `url(${imagePath})`,
                    }}
                >
                    <div className="inner-container--banner--icons">
                        <a href="#" className="add-favorite">
                            <i
                                className="fak fa-star-light"
                                aria-hidden="true"
                            ></i>
                        </a>
                    </div>
                </div>
                <div className="inner-container--det p-3 mx-2">
                    <div className="inner-container--det--title">
                        <a href="#">
                            <h2>{container.name}</h2>
                        </a>
                    </div>
                    <div className="inner-container--det--desc">
                        <p className="mb-0">{container.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
