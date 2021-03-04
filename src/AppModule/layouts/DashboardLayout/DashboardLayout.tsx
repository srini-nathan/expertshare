import React, { FC, PropsWithChildren } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { navigations } from "../../bootstrap";

export enum MenuPosition {
    LEFT = "LEFT",
    TOP = "TOP",
    BOTTOM = "BOTTOM",
}

export enum MenuPositionClass {
    LEFT = "navigation-position__left",
    TOP = "navigation-position__top",
    BOTTOM = "navigation-position__bottom",
}

export interface DashboardLayoutProps {
    menuPosition?: MenuPosition;
}

export const DashboardLayout: FC<
    PropsWithChildren<DashboardLayoutProps>
> = () => {
    return (
        <Container className={"p-0"} fluid={true}>
            <Row noGutters={true}>
                <Col md={4}>
                    <div className="list-group">
                        {navigations.map(({ label, path }) => {
                            return (
                                <a
                                    href={path}
                                    className="list-group-item list-group-item-action"
                                >
                                    <div className="d-flex w-100 justify-content-between">
                                        <h5 className="mb-1">{label}</h5>
                                    </div>
                                </a>
                            );
                        })}

                        <a
                            href="#"
                            className="list-group-item list-group-item-action"
                        >
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">App Menu # 2</h5>
                            </div>
                        </a>
                        <a
                            href="#"
                            className="list-group-item list-group-item-action"
                        >
                            <div className="d-flex w-100 justify-content-between">
                                <h5 className="mb-1">App Menu # 3</h5>
                            </div>
                        </a>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
