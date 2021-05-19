import React, { FC } from "react";
import { Row, Col } from "react-bootstrap";
import { ContainerView } from "../../models/entities/ContainerView";
import "./assets/scss/overview.scss";

export interface AppContainerComponentProps {
    containers: ContainerView[];
}

export const AppContainerComponent: FC<AppContainerComponentProps> = ({
    containers,
}): JSX.Element => {
    return (
        <Row>
            {containers.map((container) => (
                <Col
                    md={4}
                    sm={6}
                    lg={4}
                    xl={3}
                    className="container-overview--container--item"
                >
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
                </Col>
            ))}
        </Row>
    );
};
