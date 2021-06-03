import React, { FC } from "react";
// import { Col } from "react-bootstrap";
import { AppIcon } from "../AppIcon";
import "./assets/scss/list.scss";

export interface AttendeeCardProps {
    attendee: any;
}

export const AttendeeCard: FC<AttendeeCardProps> = ({
    attendee,
}): JSX.Element => {
    return (
        <div className="card p-3">
            <div className="card--icons">
                <div className="card--icons--favorite">
                    <a href="#" className="btn btn-secondary">
                        <AppIcon name="AddUserPlus" />
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
                <a href="#" className="card--title--mail mb-3 d-block">
                    {attendee.email}
                </a>
            </div>
            <div className="card--tags">
                <div className="row m-0 p-0">
                    {attendee.tags.map((tag: string, index: any) => {
                        if (index < 3) {
                            return (
                                <div className="card--tags--item col-auto px-0 mb-2">
                                    <a href="#">{tag}</a>
                                </div>
                            );
                        }
                        return <></>;
                    })}
                    {attendee.tags.length > 2 && (
                        <div className="card--tags--item show-more col-auto px-0 mb-2">
                            <a href="#">+ Show More</a>
                        </div>
                    )}
                </div>
            </div>
            <div className="card--buttons mt-3 mb-2">
                <div className="row m-0 p-0">
                    <div className="card--buttons--book-session col-6 px-2">
                        <button className="btn btn-secondary">
                            <AppIcon name="CalendarPlus" />
                            Book Session
                        </button>
                    </div>
                    <div className="card--buttons--get-in-contact col-6 px-2">
                        <button className="btn btn-secondary">
                            <AppIcon name="Conversation" />
                            Get In Contact
                            <div className="popup">
                                <div className="popup--inner">
                                    <div className="popup--inner--item video-chat">
                                        <a href="#">
                                            <AppIcon name={"Video"} />
                                            Start Video Chat
                                        </a>
                                    </div>
                                    <div className="popup--inner--item conversation">
                                        <a href="#">
                                            <AppIcon name="Conversation" />
                                            Start Conversation
                                        </a>
                                    </div>
                                    <div className="popup--inner--item view-profile">
                                        <a href="#">
                                            <AppIcon name="AddUserPlus" />
                                            View Profile
                                        </a>
                                    </div>
                                    <div className="popup--inner--item view-profile">
                                        <a href="#">
                                            <AppIcon name="Download" />
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
    );
};
