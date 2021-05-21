import React, { FC } from "react";
import { PContainer } from "../../models";
import "./assets/scss/overview.scss";

export interface AppContainerOverviewProps {
    container: PContainer;
}

export const AppContainerOverview: FC<AppContainerOverviewProps> = ({
    container,
}): JSX.Element => {
    return (
        <div className="container-overview--container--item">
            <div className="inner-container white-box">
                <div
                    className="inner-container--banner"
                    style={{
                        backgroundImage: `url(${container.imageName})`,
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
