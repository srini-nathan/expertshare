import React, { FC, PropsWithChildren } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "./style.scss";

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

export const DashboardLayout: FC<PropsWithChildren<DashboardLayoutProps>> = ({
    menuPosition = MenuPosition.LEFT,
    ...props
}) => {
    return (
        <Container fluid={true}>
            <Row>
                <Col md={3} sm={12} xl={2}>
                    <div className="left-sidebar d-block navbar-expand-md sidebar col-sm-12 col-md-3 col-xl-2 p-0">
                        <div className="row p-0 mb-md-4 m-0">
                            <div className="main-logo-container p-md-4 ">
                                <a href="#" className="main-logo col-xl-9"></a>
                            </div>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon icon icon-menu"></span>
                            </button>
                        </div>
                        <nav
                            className="collapse navbar-collapse"
                            id="navbarSupportedContent"
                        >
                            <div className="w-100">
                                <ul>
                                    <li className="nav-item mt-2 pr-3 pl-3 p-2 active">
                                        <a className="nav-link" href="#">
                                            <div className="nav-icon">
                                                <i className="icon icon-dashboard"></i>
                                            </div>
                                            <span>Dashboard</span>
                                        </a>
                                    </li>
                                    <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                        <a className="nav-link" href="#">
                                            <i className="icon icon-suitcase"></i>
                                            <span>Sponsers</span>
                                        </a>
                                    </li>

                                    <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                        <a className="nav-link" href="#">
                                            <i className="icon icon-persons"></i>
                                            <span>Attendees</span>
                                        </a>
                                    </li>

                                    <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                        <a className="nav-link" href="#">
                                            <i className="icon icon-calendar"></i>
                                            <span>My Agenda</span>
                                        </a>
                                    </li>

                                    <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                        <a className="nav-link" href="#">
                                            <i className="icon icon-video"></i>
                                            <span>Videos</span>
                                        </a>
                                    </li>
                                    <li className="nav-item mt-2 pr-3 pl-3 p-2 item-more  dropright">
                                        <a
                                            className="nav-link  dropdown-toggle"
                                            data-toggle="dropdown"
                                            aria-haspopup="true"
                                            aria-expanded="false"
                                            href="#"
                                        >
                                            <i className="icon icon-menu"></i>
                                            <span>More</span>
                                        </a>
                                        <div className="dropdown-menu">
                                            <ul>
                                                <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                                    <a
                                                        className="nav-link"
                                                        href="#"
                                                    >
                                                        <i className="icon icon-notes"></i>
                                                        <span>Notes</span>
                                                    </a>
                                                </li>

                                                <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                                    <a
                                                        className="nav-link"
                                                        href="#"
                                                    >
                                                        <i className="icon icon-message"></i>
                                                        <span>Messages</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                                    <a
                                                        className="nav-link"
                                                        href="#"
                                                    >
                                                        <i className="icon icon-analytics"></i>
                                                        <span>Analytics</span>
                                                    </a>
                                                </li>
                                                <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                                    <a
                                                        className="nav-link"
                                                        href="#"
                                                    >
                                                        <i className="icon icon-question"></i>
                                                        <span>
                                                            Questionboard
                                                            Richard
                                                        </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                    <li className="bottom-menu">
                                        <ul>
                                            <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                                <a
                                                    className="nav-link"
                                                    href="#"
                                                >
                                                    <i className="icon icon-administrator"></i>
                                                    <span>Administrator</span>
                                                </a>
                                            </li>
                                            <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                                <a
                                                    className="nav-link"
                                                    href="#"
                                                >
                                                    <i className="profile-picture"></i>
                                                    <span>Account</span>
                                                </a>
                                            </li>
                                            <li className="nav-item mt-2 pr-3 pl-3 p-2">
                                                <a
                                                    className="nav-link copyright"
                                                    href="#"
                                                >
                                                    <span>
                                                        Virtual event platform
                                                        by{" "}
                                                        <img src="./assets/image/expertshare_logo_footer.svg" />
                                                    </span>
                                                </a>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>

                                <a href="#" className="collapse-menu">
                                    <i className="icon icon-arrow-left"></i>
                                </a>
                            </div>
                        </nav>
                    </div>
                </Col>
                <Col md={9} xl={10}>
                    <Row>
                        <div className={MenuPositionClass[menuPosition]}>
                            {props.children}
                        </div>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};
