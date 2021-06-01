import React, { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AppIcon } from "../../../AppModule/components";
import "./assets/scss/list.scss";

export interface AttendeeCardProps {
    attendees: any[];
}

export const AttendeeCard: FC<AttendeeCardProps> = ({
    attendees,
}): JSX.Element => {
    return (
        <Container fluid>
            <Row>
                {attendees.map((attendee) => (
                    <Col
                        xs={12}
                        md={6}
                        lg={4}
                        xl={3}
                        className="attendees-grid--container--item"
                    >
                        <div className="card p-3">
                            <div className="card--icons">
                                <div className="card--icons--favorite">
                                    <a href="#" className="btn btn-secondary">
                                        <i
                                            className="fak fa-user-plus-regular"
                                            aria-hidden="true"
                                        ></i>
                                    </a>
                                </div>
                            </div>
                            <div className="card--avatar mt-3">
                                <a
                                    href="#"
                                    className={
                                        attendee.online
                                            ? "profile-avatar online"
                                            : "profile-avatar"
                                    }
                                >
                                    <i
                                        style={{
                                            backgroundImage: `url(${attendee.avatarUrl})`,
                                        }}
                                    ></i>
                                </a>
                                {attendee.category && (
                                    <a href="#" className="speaker-btn">
                                        <AppIcon name={"Microphone"} />
                                        &nbsp;
                                        {attendee.category}
                                    </a>
                                )}
                            </div>
                            <div className="card--title text-center mt-3">
                                <a href="#" className="card--title--name">
                                    <h2>{attendee.name}</h2>
                                </a>
                                <p className="card--title--bio mb-1 mx-2">
                                    {attendee.description}
                                </p>
                                <a
                                    href="#"
                                    className="card--title--mail mb-3 d-block"
                                >
                                    {attendee.email}
                                </a>
                            </div>
                            <div className="card--tags">
                                <div className="row m-0 p-0">
                                    <div className="card--tags--item col-auto px-0 mb-2">
                                        <a href="#">All Users</a>
                                    </div>
                                    <div className="card--tags--item col-auto px-0 mb-2">
                                        <a href="#">Special Invites</a>
                                    </div>
                                    <div className="card--tags--item col-auto px-0 mb-2">
                                        <a href="#">Another Tag Here</a>
                                    </div>
                                    <div className="card--tags--item show-more col-auto px-0 mb-2">
                                        <a href="#">+ Show More</a>
                                    </div>
                                </div>
                            </div>
                            <div className="card--buttons mt-3 mb-2">
                                <div className="row m-0 p-0">
                                    <div className="card--buttons--book-session col-6 px-2">
                                        <button className="btn btn-secondary">
                                            <i
                                                className="fak fa-calendar-plus"
                                                aria-hidden="true"
                                            ></i>
                                            Book Session
                                        </button>
                                    </div>
                                    <div className="card--buttons--get-in-contact col-6 px-2">
                                        <button className="btn btn-secondary">
                                            <i
                                                className="fak fa-start-conversation"
                                                aria-hidden="true"
                                            ></i>
                                            Get In Contact
                                            <div className="popup">
                                                <div className="popup--inner">
                                                    <div className="popup--inner--item video-chat">
                                                        <a href="#">
                                                            <i
                                                                className="fak fa-video"
                                                                aria-hidden="true"
                                                            ></i>
                                                            Start Video Chat
                                                        </a>
                                                    </div>
                                                    <div className="popup--inner--item conversation">
                                                        <a href="#">
                                                            <i
                                                                className="fak fa-start-conversation"
                                                                aria-hidden="true"
                                                            ></i>
                                                            Start Conversation
                                                        </a>
                                                    </div>
                                                    <div className="popup--inner--item view-profile">
                                                        <a href="#">
                                                            <i
                                                                className="fak fa-view-profile"
                                                                aria-hidden="true"
                                                            ></i>
                                                            View Profile
                                                        </a>
                                                    </div>
                                                    <div className="popup--inner--item view-profile">
                                                        <a href="#">
                                                            <i
                                                                className="fak fa-view-profile"
                                                                aria-hidden="true"
                                                            ></i>
                                                            Download VCF
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};
